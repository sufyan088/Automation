const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { statementUploadHelpers } = require('../../../helpers/iteration-matrix/statementUpload.js');
const { statementUploadSelectors } = require('../../../selectors/iteration-matrix/statementUpload.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  statementUploadHelpers,
  statementUploadSelectors
};
