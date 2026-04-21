const { supplierManagementImremitNewSelectors } = require('../../selectors/iteration-matrix/supplierManagementImremitNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierManagementImremitNewHelpers: {
    openModule,
    selectors: supplierManagementImremitNewSelectors
  }
};
