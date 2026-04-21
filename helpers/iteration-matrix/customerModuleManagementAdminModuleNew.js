const { customerModuleManagementAdminModuleNewSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminModuleNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerModuleManagementAdminModuleNewHelpers: {
    openModule,
    selectors: customerModuleManagementAdminModuleNewSelectors
  }
};
