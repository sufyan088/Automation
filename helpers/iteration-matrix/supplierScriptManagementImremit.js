const { supplierScriptManagementImremitSelectors } = require('../../selectors/iteration-matrix/supplierScriptManagementImremit.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierScriptManagementImremitHelpers: {
    openModule,
    selectors: supplierScriptManagementImremitSelectors
  }
};
