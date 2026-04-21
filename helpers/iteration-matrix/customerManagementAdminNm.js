const { customerManagementAdminNmSelectors } = require('../../selectors/iteration-matrix/customerManagementAdminNm.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerManagementAdminNmHelpers: {
    openModule,
    selectors: customerManagementAdminNmSelectors
  }
};
