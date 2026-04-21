const { imremitLiteDashboardPartialPaymentAlreadyTakenSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardPartialPaymentAlreadyTaken.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardPartialPaymentAlreadyTakenHelpers: {
    openModule,
    selectors: imremitLiteDashboardPartialPaymentAlreadyTakenSelectors
  }
};
