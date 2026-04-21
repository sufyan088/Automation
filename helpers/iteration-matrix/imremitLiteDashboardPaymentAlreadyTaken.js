const { imremitLiteDashboardPaymentAlreadyTakenSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardPaymentAlreadyTaken.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardPaymentAlreadyTakenHelpers: {
    openModule,
    selectors: imremitLiteDashboardPaymentAlreadyTakenSelectors
  }
};
