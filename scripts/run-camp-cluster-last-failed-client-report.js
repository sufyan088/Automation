const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { stripSourceAiqDescriptions } = require('./strip-source-aiq-from-allure-results');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const resultsDir = path.join(rootDir, 'allure-results');
const shareableDirRelative = path.join('Result', 'allure-report-combined-shareable');
const zipPathRelative = path.join('Result', 'allure-report-combined-shareable.zip');
const shareableDir = path.join(rootDir, shareableDirRelative);
const resultIndexPath = path.join(rootDir, 'Result', 'index.html');
const modulePaths = [
  'tests/DigitEYESCamp_Cluster/DigitEYESCamps_ManageCampsCluster',
  'tests/DigitEYESCamp_Cluster/DigitEYESCamps_DataForSalesforce',
  'tests/DigitEYESCamp_Cluster/DigitEYESCamps_Participants',
  'tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_DataForSalesForce',
  'tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_ParticipantConsents',
  'tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_SFDataLoaderChangeLog',
  'tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_SFDataLoaderErrorCases',
  'tests/DigitEYESCamp_Cluster/DigitEYESDataLoader_SFDataLoaderQueue',
  'tests/DigitEYESCamp_Cluster/DigitEYESReporting_CampTrends',
  'tests/DigitEYESCamp_Cluster/DigitEYESReporting_InternetAvailability',
  'tests/DigitEYESCamp_Cluster/DigitEYESReporting_PopinAvailability',
  'tests/DigitEYESCamp_Cluster/DigitEYESReporting_SummarySheetData',
  'tests/DigitEYESCamp_Cluster/DigitEYESReporting_WorkReportIPTeams',
  'tests/DigitEYESCamp_Cluster/DigitEYESReporting_WorkReportVSTeams',
  'tests/DigitEYESCamp_Cluster/DigitEYESSettings_CountrySettings',
  'tests/DigitEYESCamp_Cluster/DigitEYESSettings_DESalesforceFieldMapping',
  'tests/DigitEYESCamp_Cluster/DigitEYESSettings_Hospitals',
  'tests/DigitEYESCamp_Cluster/DigitEYESSettings_ImplementationPartners'
];

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

function syncResultIndex() {
  const shareableIndexPath = path.join(shareableDir, 'index.html');

  if (!fs.existsSync(shareableIndexPath)) {
    throw new Error(`Shareable report index not found: ${shareableIndexPath}`);
  }

  fs.copyFileSync(shareableIndexPath, resultIndexPath);
}

function main() {
  fs.mkdirSync(path.join(rootDir, 'Result'), { recursive: true });

  const testExitCode = run('npx', [
    'playwright',
    'test',
    ...modulePaths,
    '--last-failed',
    '--workers=3',
    '--reporter=allure-playwright'
  ]);

  if (!hasAllureResults()) {
    process.exit(testExitCode || 1);
  }

  const normalizeExitCode = run('node', ['scripts/normalize-allure-suites.js']);
  if (normalizeExitCode !== 0) {
    process.exit(normalizeExitCode);
  }

  const strippedCount = stripSourceAiqDescriptions(resultsDir);
  if (strippedCount > 0) {
    console.log(`Removed Source AIQ lines from ${strippedCount} Allure result files.`);
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