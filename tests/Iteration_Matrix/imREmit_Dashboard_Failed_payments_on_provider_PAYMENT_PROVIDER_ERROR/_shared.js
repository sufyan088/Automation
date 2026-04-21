const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardFailedPaymentsOnProviderPaymentProviderError.js');
const { imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardFailedPaymentsOnProviderPaymentProviderError.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorHelpers,
  imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorSelectors
};
