const { customerModuleManagementAdminModuleSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerModuleManagementAdminModuleHelpers: {
    openModule,
    selectors: customerModuleManagementAdminModuleSelectors
  }
};
