const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { proxyPayDashboardImremitLiteHelpers } = require('../../../helpers/iteration-matrix/proxyPayDashboardImremitLite.js');
const { proxyPayDashboardImremitLiteSelectors } = require('../../../selectors/iteration-matrix/proxyPayDashboardImremitLite.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  proxyPayDashboardImremitLiteHelpers,
  proxyPayDashboardImremitLiteSelectors
};
