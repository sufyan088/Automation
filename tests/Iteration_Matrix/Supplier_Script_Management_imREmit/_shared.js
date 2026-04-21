const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierScriptManagementImremitHelpers } = require('../../../helpers/iteration-matrix/supplierScriptManagementImremit.js');
const { supplierScriptManagementImremitSelectors } = require('../../../selectors/iteration-matrix/supplierScriptManagementImremit.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierScriptManagementImremitHelpers,
  supplierScriptManagementImremitSelectors
};
