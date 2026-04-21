const { customerManagementAdminNewSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerManagementAdminNewHelpers: {
    openModule,
    selectors: customerManagementAdminNewSelectors
  }
};
