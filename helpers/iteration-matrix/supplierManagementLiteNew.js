const { supplierManagementLiteNewSelectors } = require('../../selectors/iteration-matrix/supplierManagementLiteNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierManagementLiteNewHelpers: {
    openModule,
    selectors: supplierManagementLiteNewSelectors
  }
};
