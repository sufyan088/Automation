const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardInvoiceNumberMismatchHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardInvoiceNumberMismatch.js');
const { imremitLiteDashboardInvoiceNumberMismatchSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardInvoiceNumberMismatch.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardInvoiceNumberMismatchHelpers,
  imremitLiteDashboardInvoiceNumberMismatchSelectors
};
