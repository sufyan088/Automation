const { supplierManagementAdminSelectors } = require('../../selectors/iteration-matrix/supplierManagementAdmin.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierManagementAdminHelpers: {
    openModule,
    selectors: supplierManagementAdminSelectors
  }
};
