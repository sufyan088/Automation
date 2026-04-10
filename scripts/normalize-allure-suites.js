const fs = require('fs');
const path = require('path');

function humanizeSuiteName(moduleFolderName) {
  return String(moduleFolderName || '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeResultFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const result = JSON.parse(raw);
  const moduleFolderName = Array.isArray(result.titlePath) ? result.titlePath[0] : '';

  if (!moduleFolderName) {
    return false;
  }

  const moduleSuiteName = humanizeSuiteName(moduleFolderName);
  const existingLabels = Array.isArray(result.labels) ? result.labels : [];
  const preservedLabels = existingLabels.filter((label) => !['parentSuite', 'suite', 'titlePath'].includes(label.name));

  result.labels = [
    ...preservedLabels,
    { name: 'parentSuite', value: moduleSuiteName },
    { name: 'suite', value: moduleSuiteName }
  ];

  if (Array.isArray(result.parameters)) {
    result.parameters = result.parameters.filter((parameter) => parameter.name !== 'Project');
  }

  if (Array.isArray(result.titlePath) && result.titlePath[0] === 'chromium') {
    result.titlePath = result.titlePath.slice(1);
  }

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