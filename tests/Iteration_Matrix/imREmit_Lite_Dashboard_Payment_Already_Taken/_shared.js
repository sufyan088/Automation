const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardPaymentAlreadyTakenHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardPaymentAlreadyTaken.js');
const { imremitLiteDashboardPaymentAlreadyTakenSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardPaymentAlreadyTaken.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardPaymentAlreadyTakenHelpers,
  imremitLiteDashboardPaymentAlreadyTakenSelectors
};
