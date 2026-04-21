const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { paymentManagementNewHelpers } = require('../../../helpers/iteration-matrix/paymentManagementNew.js');
const { paymentManagementNewSelectors } = require('../../../selectors/iteration-matrix/paymentManagementNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  paymentManagementNewHelpers,
  paymentManagementNewSelectors
};
