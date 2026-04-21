const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { srUploadNewHelpers } = require('../../../helpers/iteration-matrix/srUploadNew.js');
const { srUploadNewSelectors } = require('../../../selectors/iteration-matrix/srUploadNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  srUploadNewHelpers,
  srUploadNewSelectors
};
