const { masterRoleSettingsAdminModuleSelectors } = require('../../selectors/iteration-matrix/masterRoleSettingsAdminModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  masterRoleSettingsAdminModuleHelpers: {
    openModule,
    selectors: masterRoleSettingsAdminModuleSelectors
  }
};
