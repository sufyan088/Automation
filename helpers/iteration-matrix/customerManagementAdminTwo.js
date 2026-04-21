const { customerManagementAdminTwoSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminTwo.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerManagementAdminTwoHelpers: {
    openModule,
    selectors: customerManagementAdminTwoSelectors
  }
};
