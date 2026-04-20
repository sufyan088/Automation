const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { flattenGenericAllureSteps } = require('./flatten-generic-allure-steps');
const { stripSourceAiqDescriptions } = require('./strip-source-aiq-from-allure-results');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const modulePath = 'tests/DigitEYESCamp_Server/01_Camp_Server_India_Registration';
const moduleDir = path.join(rootDir, modulePath);
const resultsDir = path.join(rootDir, 'allure-results');
const shareableDirRelative = path.join('Result', 'allure-report-camp-server-registration-shareable');
const zipPathRelative = path.join('Result', 'digit-eyes-camp-server-registration.zip');
const shareableDir = path.join(rootDir, shareableDirRelative);
const zipPath = path.join(rootDir, zipPathRelative);
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

function syncResultIndex() {
  const shareableIndexPath = path.join(shareableDir, 'index.html');

  if (!fs.existsSync(shareableIndexPath)) {
    throw new Error(`Shareable report index not found: ${shareableIndexPath}`);
  }

  fs.copyFileSync(shareableIndexPath, resultIndexPath);
}

function cleanResultsDir() {
  fs.rmSync(resultsDir, { recursive: true, force: true });
  fs.mkdirSync(resultsDir, { recursive: true });
}

function hasAllureResults() {
  if (!fs.existsSync(resultsDir)) {
    return false;
  }

  return fs.readdirSync(resultsDir).some((entry) => entry.endsWith('-result.json'));
}

function writeMetadataFiles() {
  const today = new Date().toISOString().slice(0, 10);
  const environment = [
    'Project=Vision Spring',
    'Module=Camp Server India Registration',
    'Scope=24 converted scripts with descriptive steps',
    `Generated=${today}`,
  ].join('\n');

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), environment, 'utf8');
  fs.writeFileSync(
    path.join(resultsDir, 'executor.json'),
    JSON.stringify({
      name: 'GitHub Copilot',
      type: 'local',
      buildName: 'Camp Server India Registration 24-script client report',
      buildOrder: 1,
      reportName: 'MAMMOTH-AI'
    }, null, 2),
    'utf8'
  );
  fs.writeFileSync(path.join(resultsDir, 'categories.json'), '[]\n', 'utf8');
}

function extractBetween(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function humanizeTitle(title) {
  return title
    .replace(/\.spec\.js$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadSpecMetadata() {
  const metadata = new Map();
  const specFiles = fs
    .readdirSync(moduleDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.spec.js'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  for (const fileName of specFiles) {
    const filePath = path.join(moduleDir, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    const title = extractBetween(content, /test\((?:"|')(.+?)(?:"|')\s*,/s);

    if (!title) {
      continue;
    }

    const descriptionLines = [
      `Scenario: ${humanizeTitle(title)}`,
      `Spec File: ${path.posix.join(modulePath.replace(/\\/g, '/'), fileName)}`,
    ];

    metadata.set(title, {
      description: descriptionLines.join('\n')
    });
  }

  return metadata;
}

function enrichAllureResults() {
  const metadataByTitle = loadSpecMetadata();
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

function main() {
  cleanResultsDir();
  fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });
  writeMetadataFiles();

  const testExitCode = run('npx', [
    'playwright',
    'test',
    modulePath,
    '--workers=1',
    '--reporter=allure-playwright'
  ]);

  if (!hasAllureResults()) {
    process.exit(testExitCode || 1);
  }

  const normalizeExitCode = run('node', ['scripts/normalize-allure-suites.js']);
  if (normalizeExitCode !== 0) {
    process.exit(normalizeExitCode);
  }

  const flattenedCount = flattenGenericAllureSteps(resultsDir);
  if (flattenedCount > 0) {
    console.log(`Flattened generic wrapper steps in ${flattenedCount} Allure result files.`);
  }

  enrichAllureResults();
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

  syncResultIndex();

  const zipExitCode = run('powershell', [
    '-NoProfile',
    '-Command',
    `$zip='${zipPathRelative.replace(/'/g, "''")}'; if (Test-Path $zip) { Remove-Item $zip -Force }; Compress-Archive -Path '${shareableDirRelative.replace(/'/g, "''")}\\*' -DestinationPath $zip -Force`
  ]);

  if (zipExitCode !== 0) {
    process.exit(zipExitCode);
  }

  process.exit(testExitCode);
}

main();