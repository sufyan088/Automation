const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierManagementImremitNewHelpers } = require('../../../helpers/iteration-matrix/supplierManagementImremitNew.js');
const { supplierManagementImremitNewSelectors } = require('../../../selectors/iteration-matrix/supplierManagementImremitNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierManagementImremitNewHelpers,
  supplierManagementImremitNewSelectors
};
