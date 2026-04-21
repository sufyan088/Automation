const { customerModuleManagementAdminTwoSelectors } = require('../../selectors/iteration-matrix/customerModuleManagementAdminTwo.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerModuleManagementAdminTwoHelpers: {
    openModule,
    selectors: customerModuleManagementAdminTwoSelectors
  }
};
