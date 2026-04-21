const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { paymentManagementImremitHelpers } = require('../../../helpers/iteration-matrix/paymentManagementImremit.js');
const { paymentManagementImremitSelectors } = require('../../../selectors/iteration-matrix/paymentManagementImremit.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  paymentManagementImremitHelpers,
  paymentManagementImremitSelectors
};
