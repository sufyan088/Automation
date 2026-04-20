const fs = require('fs');
const path = require('path');

function stripSourceAiqDescriptions(resultsDir = path.join(__dirname, '..', 'allure-results')) {
  if (!fs.existsSync(resultsDir)) {
    return 0;
  }

  let updatedCount = 0;

  for (const entry of fs.readdirSync(resultsDir)) {
    if (!entry.endsWith('-result.json')) {
      continue;
    }

    const filePath = path.join(resultsDir, entry);
    const result = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (typeof result.description !== 'string' || !result.description.includes('Source AIQ:')) {
      continue;
    }

    result.description = result.description
      .split('\n')
      .filter((line) => !line.trim().startsWith('Source AIQ:'))
      .join('\n')
      .trim();
    fs.writeFileSync(filePath, JSON.stringify(result), 'utf8');
    updatedCount += 1;
  }

  return updatedCount;
}

if (require.main === module) {
  const updatedCount = stripSourceAiqDescriptions();

  if (updatedCount > 0) {
    console.log(`Removed Source AIQ lines from ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  stripSourceAiqDescriptions,
};