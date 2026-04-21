const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierMasterListHelpers } = require('../../../helpers/iteration-matrix/supplierMasterList.js');
const { supplierMasterListSelectors } = require('../../../selectors/iteration-matrix/supplierMasterList.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierMasterListHelpers,
  supplierMasterListSelectors
};
