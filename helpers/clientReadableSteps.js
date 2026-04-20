const { test } = require('@playwright/test');

function humanizeStepName(name) {
  return String(name || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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
  humanizeStepName,
  wrapHelperMapWithReadableSteps,
};