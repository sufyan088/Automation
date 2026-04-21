const { imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorSelectors } = require('../../selectors/iteration-matrix/imremitDashboardFailedPaymentsOnProviderPaymentProviderError.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorHelpers: {
    openModule,
    selectors: imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorSelectors
  }
};
