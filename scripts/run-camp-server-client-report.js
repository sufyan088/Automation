const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const orderedModules = require('./camp-server-modules');

const rootDir = path.resolve(__dirname, '..');
const resultsDir = path.join(rootDir, 'allure-results');
const shareableDir = path.join(rootDir, 'Result', 'allure-report-camp-server-shareable');
const zipPath = path.join(rootDir, 'Result', 'digit-eyes-camp-server.zip');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
    ...options,
  });

  if (typeof result.status === 'number') {
    return result.status;
  }

  return 1;
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

  const generateExitCode = run('npx', [
    'allure',
    'generate',
    'allure-results',
    '--clean',
    '--single-file',
    '-o',
    shareableDir
  ]);

  if (generateExitCode !== 0) {
    process.exit(generateExitCode);
  }

  const brandExitCode = run('node', ['scripts/customize-allure-report.js', shareableDir]);
  if (brandExitCode !== 0) {
    process.exit(brandExitCode);
  }

  const zipExitCode = run('powershell', [
    '-NoProfile',
    '-Command',
    `$zip='${zipPath.replace(/'/g, "''")}'; if (Test-Path $zip) { Remove-Item $zip -Force }; Compress-Archive -Path '${shareableDir.replace(/'/g, "''")}\\*' -DestinationPath $zip -Force`
  ]);

  if (zipExitCode !== 0) {
    process.exit(zipExitCode);
  }

  process.exit(testExitCode);
}

main();