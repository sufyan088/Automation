const { criteriaSettingsSelectors } = require('../../selectors/iteration-matrix/criteriaSettings.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  criteriaSettingsHelpers: {
    openModule,
    selectors: criteriaSettingsSelectors
  }
};
