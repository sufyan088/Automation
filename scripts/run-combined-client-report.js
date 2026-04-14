const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const resultsDir = path.join(rootDir, 'allure-results');
const shareableDir = path.join(rootDir, 'Result', 'allure-report-combined-shareable');
const zipPath = path.join(rootDir, 'Result', 'allure-report-combined-shareable.zip');

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

  const testExitCode = run('npx', [
    'playwright',
    'test',
    'tests/DigitEYESCamps_ManageCampsCluster',
    'tests/DigitEYESCamps_DataForSalesforce',
    'tests/DigitEYESCamps_Participants',
    'tests/DigitEYESDataLoader_DataForSalesForce',
    'tests/DigitEYESDataLoader_ParticipantConsents',
    'tests/DigitEYESDataLoader_SFDataLoaderChangeLog',
    'tests/DigitEYESDataLoader_SFDataLoaderErrorCases',
    'tests/DigitEYESDataLoader_SFDataLoaderQueue',
    'tests/DigitEYESReporting_CampTrends',
    'tests/DigitEYESReporting_InternetAvailability',
    'tests/DigitEYESReporting_PopinAvailability',
    'tests/DigitEYESReporting_SummarySheetData',
    'tests/DigitEYESReporting_WorkReportIPTeams',
    'tests/DigitEYESReporting_WorkReportVSTeams',
    'tests/DigitEYESSettings_CountrySettings',
    'tests/DigitEYESSettings_DESalesforceFieldMapping',
    'tests/DigitEYESSettings_Hospitals',
    'tests/DigitEYESSettings_ImplementationPartners',
    '--workers=3',
    '--reporter=allure-playwright'
  ]);

  if (!hasAllureResults()) {
    process.exit(testExitCode || 1);
  }

  const generateExitCode = run('npx', [
    'allure',
    'generate',
    'allure-results',
    '--clean',
    '--single-file',
    '-o',
    'allure-report-combined-shareable'
  ]);

  if (generateExitCode !== 0) {
    process.exit(generateExitCode);
  }

  const brandExitCode = run('node', ['scripts/customize-allure-report.js', 'allure-report-combined-shareable']);

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