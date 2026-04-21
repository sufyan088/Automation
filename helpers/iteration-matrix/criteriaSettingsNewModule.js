const { criteriaSettingsNewModuleSelectors } = require('../../selectors/iteration-matrix/criteriaSettingsNewModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  criteriaSettingsNewModuleHelpers: {
    openModule,
    selectors: criteriaSettingsNewModuleSelectors
  }
};
