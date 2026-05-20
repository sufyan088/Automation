const { test } = require('@playwright/test');

function humanizeStepName(name) {
  return String(name || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
}

function humanizeScenarioTitle(scenarioName) {
  const raw = String(scenarioName || '').replace(/\.spec\.js$/i, '').trim();
  const tsMatch = raw.match(/^TS_(\d+)_(.+)$/i);

  if (tsMatch) {
    return `TS ${tsMatch[1]} - ${tsMatch[2].replace(/_/g, ' ').replace(/\s+/g, ' ').trim()}`;
  }

  return raw.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

function businessAssertionStepTitle(scenarioName) {
  const title = humanizeScenarioTitle(scenarioName)
    .replace(/^T[SC]\s*\d+\s*-\s*/i, '')
    .trim();

  return title
    .replace(/^to verify that\b/i, 'Verify that')
    .replace(/^to verify\b/i, 'Verify')
    .replace(/^to /i, '')
    .replace(/^./, (character) => character.toUpperCase());
}

function wrapHelperMapWithReadableSteps(helperMap, labels = {}) {
  return Object.fromEntries(
    Object.entries(helperMap).map(([key, value]) => {
      if (typeof value !== 'function') {
        return [key, value];
      }

      const title = labels[key] || humanizeStepName(key);
      return [key, async (...args) => test.step(title, async () => value(...args))];
    })
  );
}

module.exports = {
  businessAssertionStepTitle,
  humanizeStepName,
  humanizeScenarioTitle,
  wrapHelperMapWithReadableSteps,
};