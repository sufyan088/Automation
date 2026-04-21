const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { proxyPayDashboardImremitLiteNewHelpers } = require('../../../helpers/iteration-matrix/proxyPayDashboardImremitLiteNew.js');
const { proxyPayDashboardImremitLiteNewSelectors } = require('../../../selectors/iteration-matrix/proxyPayDashboardImremitLiteNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  proxyPayDashboardImremitLiteNewHelpers,
  proxyPayDashboardImremitLiteNewSelectors
};
