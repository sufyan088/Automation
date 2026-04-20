const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const orderedModules = require('./camp-server-modules');
const { flattenGenericAllureSteps } = require('./flatten-generic-allure-steps');
const { stripSourceAiqDescriptions } = require('./strip-source-aiq-from-allure-results');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const resultsDir = path.join(rootDir, 'allure-results');
const shareableDirRelative = path.join('Result', 'allure-report-camp-server-shareable');
const zipPathRelative = path.join('Result', 'digit-eyes-camp-server.zip');
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

  return fs.readdirSync(resultsDir).length > 0;
}

function main() {
  cleanResultsDir();
  fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });

  let testExitCode = 0;
  for (const modulePath of orderedModules) {
    const moduleExitCode = run('npx', [
      'playwright',
      'test',
      modulePath,
      '--workers=1',
      '--reporter=allure-playwright'
    ]);

    if (moduleExitCode !== 0) {
      testExitCode = moduleExitCode;
      break;
    }
  }

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