const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierManagementImremitLiteHelpers } = require('../../../helpers/iteration-matrix/supplierManagementImremitLite.js');
const { supplierManagementImremitLiteSelectors } = require('../../../selectors/iteration-matrix/supplierManagementImremitLite.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierManagementImremitLiteHelpers,
  supplierManagementImremitLiteSelectors
};
