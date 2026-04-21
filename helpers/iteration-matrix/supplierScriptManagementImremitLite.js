const { supplierScriptManagementImremitLiteSelectors } = require('../../selectors/iteration-matrix/supplierScriptManagementImremitLite.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierScriptManagementImremitLiteHelpers: {
    openModule,
    selectors: supplierScriptManagementImremitLiteSelectors
  }
};
