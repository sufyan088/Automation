const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardInvoiceAmountMismatchHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardInvoiceAmountMismatch.js');
const { imremitLiteDashboardInvoiceAmountMismatchSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardInvoiceAmountMismatch.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardInvoiceAmountMismatchHelpers,
  imremitLiteDashboardInvoiceAmountMismatchSelectors
};
