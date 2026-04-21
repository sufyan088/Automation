const { criteriaSettingsTwoSelectors } = require('../../selectors/iteration-matrix/criteriaSettingsTwo.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  criteriaSettingsTwoHelpers: {
    openModule,
    selectors: criteriaSettingsTwoSelectors
  }
};
