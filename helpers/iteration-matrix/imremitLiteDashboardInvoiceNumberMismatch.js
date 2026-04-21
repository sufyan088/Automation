const { imremitLiteDashboardInvoiceNumberMismatchSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardInvoiceNumberMismatch.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardInvoiceNumberMismatchHelpers: {
    openModule,
    selectors: imremitLiteDashboardInvoiceNumberMismatchSelectors
  }
};
