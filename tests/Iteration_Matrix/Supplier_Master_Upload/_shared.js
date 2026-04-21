const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierMasterUploadHelpers } = require('../../../helpers/iteration-matrix/supplierMasterUpload.js');
const { supplierMasterUploadSelectors } = require('../../../selectors/iteration-matrix/supplierMasterUpload.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierMasterUploadHelpers,
  supplierMasterUploadSelectors
};
