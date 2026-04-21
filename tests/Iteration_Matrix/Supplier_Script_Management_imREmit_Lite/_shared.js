const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierScriptManagementImremitLiteHelpers } = require('../../../helpers/iteration-matrix/supplierScriptManagementImremitLite.js');
const { supplierScriptManagementImremitLiteSelectors } = require('../../../selectors/iteration-matrix/supplierScriptManagementImremitLite.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierScriptManagementImremitLiteHelpers,
  supplierScriptManagementImremitLiteSelectors
};
