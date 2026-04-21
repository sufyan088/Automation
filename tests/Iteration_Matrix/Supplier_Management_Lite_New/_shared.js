const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierManagementLiteNewHelpers } = require('../../../helpers/iteration-matrix/supplierManagementLiteNew.js');
const { supplierManagementLiteNewSelectors } = require('../../../selectors/iteration-matrix/supplierManagementLiteNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierManagementLiteNewHelpers,
  supplierManagementLiteNewSelectors
};
