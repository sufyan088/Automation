const { exportInvoicesDupesSelectors } = require('../../selectors/iteration-matrix/exportInvoicesDupes.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  exportInvoicesDupesHelpers: {
    openModule,
    selectors: exportInvoicesDupesSelectors
  }
};
