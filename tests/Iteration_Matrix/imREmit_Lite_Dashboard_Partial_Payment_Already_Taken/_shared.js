const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardPartialPaymentAlreadyTakenHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardPartialPaymentAlreadyTaken.js');
const { imremitLiteDashboardPartialPaymentAlreadyTakenSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardPartialPaymentAlreadyTaken.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardPartialPaymentAlreadyTakenHelpers,
  imremitLiteDashboardPartialPaymentAlreadyTakenSelectors
};
