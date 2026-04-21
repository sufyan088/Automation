const { supplierManagementImremitLiteSelectors } = require('../../selectors/iteration-matrix/supplierManagementImremitLite.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierManagementImremitLiteHelpers: {
    openModule,
    selectors: supplierManagementImremitLiteSelectors
  }
};
