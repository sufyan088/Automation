const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { paymentManagementImremitLiteHelpers } = require('../../../helpers/iteration-matrix/paymentManagementImremitLite.js');
const { paymentManagementImremitLiteSelectors } = require('../../../selectors/iteration-matrix/paymentManagementImremitLite.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  paymentManagementImremitLiteHelpers,
  paymentManagementImremitLiteSelectors
};
