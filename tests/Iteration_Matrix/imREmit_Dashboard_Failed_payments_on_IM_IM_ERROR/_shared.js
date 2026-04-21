const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardFailedPaymentsOnImImErrorHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardFailedPaymentsOnImImError.js');
const { imremitDashboardFailedPaymentsOnImImErrorSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardFailedPaymentsOnImImError.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardFailedPaymentsOnImImErrorHelpers,
  imremitDashboardFailedPaymentsOnImImErrorSelectors
};
