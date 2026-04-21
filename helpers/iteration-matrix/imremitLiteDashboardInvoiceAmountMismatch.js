const { imremitLiteDashboardInvoiceAmountMismatchSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardInvoiceAmountMismatch.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardInvoiceAmountMismatchHelpers: {
    openModule,
    selectors: imremitLiteDashboardInvoiceAmountMismatchSelectors
  }
};
