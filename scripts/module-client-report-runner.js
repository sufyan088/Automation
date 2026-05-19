const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { flattenGenericAllureSteps } = require('./flatten-generic-allure-steps');
const {
  cleanDir,
  createBackup,
  restoreBackup,
  cleanupBackup,
  mergeBaselineIntoRerunResults,
} = require('./merge-last-failed-allure-results');
const { stripSourceAiqDescriptions } = require('./strip-source-aiq-from-allure-results');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const resultsDir = path.join(rootDir, 'allure-results');
const resultIndexPath = path.join(rootDir, 'Result', 'index.html');

function resolveCommand(command) {
  if (!isWindows) {
    return command;
  }

  if (command === 'npx') {
    return 'npx.cmd';
  }

  if (command === 'powershell') {
    return 'powershell.exe';
  }

  return command;
}

function quoteForCmd(value) {
  const stringValue = String(value);
  return `"${stringValue.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/g, '$1$1')}"`;
}

function buildCmdCommandLine(command, args) {
  const formattedArgs = (args || [])
    .map((arg) => (/^[A-Za-z0-9_./:=\\-]+$/.test(String(arg)) ? String(arg) : quoteForCmd(arg)))
    .join(' ');
  return formattedArgs ? `${command} ${formattedArgs}` : command;
}

function run(command, args, options = {}) {
  const resolvedCommand = resolveCommand(command);
  const spawnArgs = args || [];
  const spawnCommand = isWindows && resolvedCommand.toLowerCase().endsWith('.cmd')
    ? 'cmd.exe'
    : resolvedCommand;
  const finalArgs = isWindows && resolvedCommand.toLowerCase().endsWith('.cmd')
    ? ['/d', '/s', '/c', buildCmdCommandLine(resolvedCommand, spawnArgs)]
    : spawnArgs;
  const result = spawnSync(spawnCommand, finalArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (typeof result.status === 'number') {
    return result.status;
  }

  return 1;
}

function runWithResult(command, args, options = {}) {
  const resolvedCommand = resolveCommand(command);
  const spawnArgs = args || [];
  const spawnCommand = isWindows && resolvedCommand.toLowerCase().endsWith('.cmd')
    ? 'cmd.exe'
    : resolvedCommand;
  const finalArgs = isWindows && resolvedCommand.toLowerCase().endsWith('.cmd')
    ? ['/d', '/s', '/c', buildCmdCommandLine(resolvedCommand, spawnArgs)]
    : spawnArgs;
  const result = spawnSync(spawnCommand, finalArgs, {
    cwd: rootDir,
    encoding: 'utf8',
    shell: false,
    ...options,
  });

  return {
    status: typeof result.status === 'number' ? result.status : 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function hasAllureResults() {
  if (!fs.existsSync(resultsDir)) {
    return false;
  }

  return fs.readdirSync(resultsDir).some((entry) => entry.endsWith('-result.json'));
}

function syncResultIndex(shareableDir) {
  const shareableIndexPath = path.join(shareableDir, 'index.html');

  if (!fs.existsSync(shareableIndexPath)) {
    throw new Error(`Shareable report index not found: ${shareableIndexPath}`);
  }

  fs.copyFileSync(shareableIndexPath, resultIndexPath);
}

function writeMetadataFiles(environmentLines, executor) {
  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), environmentLines.join('\n'), 'utf8');
  fs.writeFileSync(path.join(resultsDir, 'executor.json'), JSON.stringify(executor, null, 2), 'utf8');
  fs.writeFileSync(path.join(resultsDir, 'categories.json'), '[]\n', 'utf8');
}

function extractBetween(text, pattern) {
  const match = text.match(pattern);
  return match ? (match[1] || match[2] || null) : null;
}

const displayTitleOverrides = {
  TS_78_To_verify_that_Company_Industry_field_accepts_special_characters_and_create_customer:
    'TS 78 - To verify that Company Industry field accepts supported special characters and creates customer',
  TS_79_To_verify_that_Customer_ERP_System_field_accepts_special_characters_and_create_customer:
    'TS 79 - To verify that Customer ERP System field accepts hyphenated values and creates customer',
  TS_80_To_verify_that_Contact_Name_field_accepts_special_characters_and_create_customer:
    'TS 80 - To verify that Contact Name field accepts supported punctuation and creates customer',
  TS_86_To_verify_that_Company_Industry_field_accepts_length_of_one_character_while_customer_is_creating_their_time:
    'TS 86 - To verify that Company Industry field accepts the minimum valid length during customer creation',
  TS_88_To_verify_that_Customer_ERP_System_field_accepts_length_of_one_character_while_customer_is_creating_their_time:
    'TS 88 - To verify that Customer ERP System field accepts the minimum valid length during customer creation',
  TS_90_To_verify_that_Customer_Contact_Name_field_accepts_length_of_one_character_while_customer_is_creating_their_time:
    'TS 90 - To verify that Customer Contact Name field accepts the minimum valid length during customer creation'
};

function humanizeTitle(title) {
  const cleaned = title.replace(/\.spec\.js$/i, '').trim();

  if (displayTitleOverrides[cleaned]) {
    return displayTitleOverrides[cleaned];
  }

  const tsMatch = cleaned.match(/^TS_(\d+)_(.+)$/i);

  if (tsMatch) {
    return `TS ${tsMatch[1]} - ${tsMatch[2].replace(/_/g, ' ').replace(/\s+/g, ' ').trim()}`;
  }

  return cleaned
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectSpecFiles(currentDir, collected = []) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  entries
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .forEach((entry) => {
      collectSpecFiles(path.join(currentDir, entry.name), collected);
    });

  entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.spec.js'))
    .sort((left, right) => left.name.localeCompare(right.name))
    .forEach((entry) => {
      collected.push(path.join(currentDir, entry.name));
    });

  return collected;
}

function loadSpecMetadata(moduleDir) {
  const metadata = new Map();
  const specFiles = collectSpecFiles(moduleDir);

  for (const filePath of specFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const title = extractBetween(content, /test\((?:"([^"]+)"|'([^']+)')\s*,/s);

    if (!title) {
      continue;
    }

    const relativeSpecPath = path.relative(rootDir, filePath).split(path.sep).join('/');
    const descriptionLines = [
      `Scenario: ${humanizeTitle(title)}`,
      `Spec File: ${relativeSpecPath}`,
    ];

    metadata.set(title, {
      description: descriptionLines.join('\n')
    });
  }

  return metadata;
}

function enrichAllureResults(moduleDir) {
  const metadataByTitle = loadSpecMetadata(moduleDir);
  let updatedCount = 0;

  for (const entry of fs.readdirSync(resultsDir)) {
    if (!entry.endsWith('-result.json')) {
      continue;
    }

    const filePath = path.join(resultsDir, entry);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const originalName = result.name;
    const metadata = metadataByTitle.get(originalName);

    if (!metadata) {
      continue;
    }

    result.name = humanizeTitle(originalName);
    result.description = metadata.description;
    fs.writeFileSync(filePath, JSON.stringify(result), 'utf8');
    updatedCount += 1;
  }

  console.log(`Enriched Allure descriptions in ${updatedCount} result files.`);
}

function createModuleClientReportRunner(config) {
  const {
    modulePath,
    testPath = modulePath,
    useExactSpecFiles = false,
    shareableDirRelative,
    zipPathRelative,
    environmentLines,
    executor,
    mode = 'full',
    workers = 3,
    backupPrefix = 'vision-spring-module-allure-',
    postProcessResults,
  } = config;

  const moduleDir = path.join(rootDir, modulePath);
  const shareableDir = path.join(rootDir, shareableDirRelative);
  const exactSpecFiles = useExactSpecFiles
    ? collectSpecFiles(moduleDir).map((filePath) => path.relative(rootDir, filePath).split(path.sep).join('/'))
    : null;

  return function runModuleClientReport() {
    let baselineBackupDir = null;
    let reusedBaselineWithoutRerun = false;

    if (mode === 'last-failed') {
      baselineBackupDir = createBackup(resultsDir, backupPrefix);
      fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });
      cleanDir(resultsDir);
    } else {
      cleanDir(resultsDir);
      fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });
    }

    const testArgs = ['playwright', 'test'];

    if (useExactSpecFiles) {
      testArgs.push(...exactSpecFiles);
    } else {
      testArgs.push(testPath);
    }

    if (mode === 'last-failed') {
      testArgs.push('--last-failed');
    }

    testArgs.push(`--workers=${workers}`, '--reporter=allure-playwright');

    const testRun = mode === 'last-failed'
      ? runWithResult('npx', testArgs)
      : { status: run('npx', testArgs), stdout: '', stderr: '' };
    const testExitCode = testRun.status;

    if (mode === 'last-failed' && testRun.stdout) {
      process.stdout.write(testRun.stdout);
    }

    if (mode === 'last-failed' && testRun.stderr) {
      process.stderr.write(testRun.stderr);
    }

    if (!hasAllureResults()) {
      if (mode === 'last-failed') {
        const noFailedSpecsToRerun = /No tests found\./i.test(`${testRun.stdout}\n${testRun.stderr}`);

        if (noFailedSpecsToRerun && baselineBackupDir) {
          restoreBackup(baselineBackupDir, resultsDir);
          reusedBaselineWithoutRerun = true;
          console.log('No failed specs were available for rerun; regenerated the module report from the existing baseline results.');
        } else {
          restoreBackup(baselineBackupDir, resultsDir);
          cleanupBackup(baselineBackupDir);
          process.exit(testExitCode || 1);
        }
      }

      if (!mode || mode !== 'last-failed') {
        process.exit(testExitCode || 1);
      }
    }

    if (mode === 'last-failed') {
      if (reusedBaselineWithoutRerun) {
        cleanupBackup(baselineBackupDir);
      } else {
        const mergeSummary = mergeBaselineIntoRerunResults({
          baselineDir: baselineBackupDir,
          resultsDir,
        });
        cleanupBackup(baselineBackupDir);

        if (mergeSummary.replacedBaselineResults > 0 || mergeSummary.mergedBaselineResults > 0) {
          console.log(
            `Merged last-failed rerun into baseline Allure results: replaced ${mergeSummary.replacedBaselineResults} previous test entries and kept ${mergeSummary.mergedBaselineResults} unchanged baseline entries.`
          );
        }
      }
    }

    writeMetadataFiles(environmentLines, executor);

    const normalizeExitCode = run('node', ['scripts/normalize-allure-suites.js']);
    if (normalizeExitCode !== 0) {
      process.exit(normalizeExitCode);
    }

    const flattenedCount = flattenGenericAllureSteps(resultsDir);
    if (flattenedCount > 0) {
      console.log(`Flattened generic wrapper steps in ${flattenedCount} Allure result files.`);
    }

    enrichAllureResults(moduleDir);
    stripSourceAiqDescriptions(resultsDir);

    if (typeof postProcessResults === 'function') {
      postProcessResults({
        resultsDir,
        moduleDir,
        rootDir,
      });
    }

    const generateExitCode = run('npx', [
      'allure',
      'generate',
      'allure-results',
      '--clean',
      '--single-file',
      '-o',
      shareableDirRelative
    ]);

    if (generateExitCode !== 0) {
      process.exit(generateExitCode);
    }

    const brandExitCode = run('node', ['scripts/customize-allure-report.js', shareableDir]);
    if (brandExitCode !== 0) {
      process.exit(brandExitCode);
    }

    syncResultIndex(shareableDir);

    const zipExitCode = run('powershell', [
      '-NoProfile',
      '-Command',
      `$zip='${zipPathRelative.replace(/'/g, "''")}'; if (Test-Path $zip) { Remove-Item $zip -Force }; Compress-Archive -Path '${shareableDirRelative.replace(/'/g, "''")}\\*' -DestinationPath $zip -Force`
    ]);

    if (zipExitCode !== 0) {
      process.exit(zipExitCode);
    }

    process.exit(reusedBaselineWithoutRerun ? 0 : testExitCode);
  };
}

module.exports = {
  createModuleClientReportRunner,
};