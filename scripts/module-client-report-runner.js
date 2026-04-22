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

function humanizeTitle(title) {
  return title
    .replace(/\.spec\.js$/i, '')
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
    const metadata = metadataByTitle.get(result.name);

    if (!metadata) {
      continue;
    }

    result.description = metadata.description;
    fs.writeFileSync(filePath, JSON.stringify(result), 'utf8');
    updatedCount += 1;
  }

  console.log(`Enriched Allure descriptions in ${updatedCount} result files.`);
}

function createModuleClientReportRunner(config) {
  const {
    modulePath,
    shareableDirRelative,
    zipPathRelative,
    environmentLines,
    executor,
    mode = 'full',
    workers = 3,
    backupPrefix = 'vision-spring-module-allure-',
  } = config;

  const moduleDir = path.join(rootDir, modulePath);
  const shareableDir = path.join(rootDir, shareableDirRelative);

  return function runModuleClientReport() {
    let baselineBackupDir = null;

    if (mode === 'last-failed') {
      baselineBackupDir = createBackup(resultsDir, backupPrefix);
      fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });
      cleanDir(resultsDir);
    } else {
      cleanDir(resultsDir);
      fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });
    }

    const testArgs = [
      'playwright',
      'test',
      modulePath,
    ];

    if (mode === 'last-failed') {
      testArgs.push('--last-failed');
    }

    testArgs.push(`--workers=${workers}`, '--reporter=allure-playwright');

    const testExitCode = run('npx', testArgs);

    if (!hasAllureResults()) {
      if (mode === 'last-failed') {
        restoreBackup(baselineBackupDir, resultsDir);
        cleanupBackup(baselineBackupDir);
      }

      process.exit(testExitCode || 1);
    }

    if (mode === 'last-failed') {
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

    process.exit(testExitCode);
  };
}

module.exports = {
  createModuleClientReportRunner,
};