const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { paymentManagementImremitLiteNewHelpers } = require('../../../helpers/iteration-matrix/paymentManagementImremitLiteNew.js');
const { paymentManagementImremitLiteNewSelectors } = require('../../../selectors/iteration-matrix/paymentManagementImremitLiteNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  paymentManagementImremitLiteNewHelpers,
  paymentManagementImremitLiteNewSelectors
};
