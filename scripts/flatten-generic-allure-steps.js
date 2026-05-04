const fs = require('fs');
const path = require('path');

const GENERIC_STEP_NAMES = new Set([
  'run converted flow',
]);

const GENERIC_STEP_PATTERNS = [
  /^run ts\b/i,
];

function isGenericWrapperStep(step) {
  return Boolean(step)
    && typeof step.name === 'string'
    && (
      GENERIC_STEP_NAMES.has(step.name.trim().toLowerCase())
      || GENERIC_STEP_PATTERNS.some((pattern) => pattern.test(step.name.trim()))
    )
    && Array.isArray(step.steps)
    && step.steps.length > 0
    && (!Array.isArray(step.attachments) || step.attachments.length === 0)
    && (!Array.isArray(step.parameters) || step.parameters.length === 0);
}

function flattenSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return steps;
  }

  const flattened = [];

  for (const step of steps) {
    if (!step || typeof step !== 'object') {
      flattened.push(step);
      continue;
    }

    const normalizedStep = {
      ...step,
      steps: flattenSteps(step.steps),
    };

    if (isGenericWrapperStep(normalizedStep)) {
      flattened.push(...normalizedStep.steps);
      continue;
    }

    flattened.push(normalizedStep);
  }

  return flattened;
}

function flattenGenericAllureSteps(resultsDir = path.join(__dirname, '..', 'allure-results')) {
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
    const originalSteps = JSON.stringify(result.steps || []);
    result.steps = flattenSteps(result.steps || []);

    if (JSON.stringify(result.steps) === originalSteps) {
      continue;
    }

    fs.writeFileSync(filePath, JSON.stringify(result), 'utf8');
    updatedCount += 1;
  }

  return updatedCount;
}

if (require.main === module) {
  const updatedCount = flattenGenericAllureSteps();

  if (updatedCount > 0) {
    console.log(`Flattened generic wrapper steps in ${updatedCount} Allure result files.`);
  }
}

module.exports = {
  flattenGenericAllureSteps,
};