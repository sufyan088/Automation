const fs = require('fs');
const path = require('path');

function humanizeSuiteName(moduleFolderName) {
  return String(moduleFolderName || '')
    .replace(/^\d+_/, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const containerFolderNames = new Set(['DigitEYESCamp_Cluster', 'DigitEYESCamp_Server', 'Iteration_Matrix']);

function isModuleFolderName(entry) {
  return Boolean(entry)
    && !containerFolderNames.has(entry)
    && !/\.spec\.[jt]s$/i.test(entry);
}

function resolveModuleFolderName(titlePath) {
  if (!Array.isArray(titlePath)) {
    return '';
  }

  const moduleEntry = titlePath.find((entry) => /^(DigitEYESCamps_|DigitEYESDataLoader_|DigitEYESReporting_|DigitEYESSettings_|Camp_Server_)/.test(entry));
  if (moduleEntry) {
    return moduleEntry;
  }

  const iterationMatrixEntry = titlePath.find((entry) => entry !== 'Iteration_Matrix' && titlePath.includes('Iteration_Matrix'));
  if (iterationMatrixEntry && isModuleFolderName(iterationMatrixEntry)) {
    return iterationMatrixEntry;
  }

  const fallbackEntry = titlePath.find((entry) => isModuleFolderName(entry));
  return fallbackEntry || titlePath[0] || '';
}

function buildNormalizedTitlePathLabel(titlePath) {
  if (!Array.isArray(titlePath) || titlePath.length === 0) {
    return '';
  }

  return ` > ${titlePath.join(' > ')}`;
}

function normalizeResultFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const result = JSON.parse(raw);
  const moduleFolderName = resolveModuleFolderName(result.titlePath);

  if (!moduleFolderName) {
    return false;
  }

  const moduleSuiteName = humanizeSuiteName(moduleFolderName);
  const normalizedTitlePathLabel = buildNormalizedTitlePathLabel(result.titlePath);
  const existingLabels = Array.isArray(result.labels) ? result.labels : [];
  const preservedLabels = existingLabels.filter((label) => label.name !== 'parentSuite' && label.name !== 'suite' && label.name !== 'titlePath');

  result.labels = [
    ...preservedLabels,
    ...(normalizedTitlePathLabel ? [{ name: 'titlePath', value: normalizedTitlePathLabel }] : []),
    { name: 'parentSuite', value: moduleSuiteName },
    { name: 'suite', value: moduleSuiteName }
  ];

  fs.writeFileSync(filePath, JSON.stringify(result));
  return true;
}

function main() {
  const resultsDir = path.resolve(process.argv[2] || 'allure-results');

  if (!fs.existsSync(resultsDir)) {
    throw new Error(`Allure results directory not found: ${resultsDir}`);
  }

  const files = fs.readdirSync(resultsDir)
    .filter((name) => name.endsWith('-result.json'))
    .map((name) => path.join(resultsDir, name));

  let updatedCount = 0;
  for (const filePath of files) {
    if (normalizeResultFile(filePath)) {
      updatedCount += 1;
    }
  }

  console.log(`Normalized suite labels in ${updatedCount} Allure result files.`);
}

main();