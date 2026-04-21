const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { userManagementAdminHelpers } = require('../../../helpers/iteration-matrix/userManagementAdmin.js');
const { userManagementAdminSelectors } = require('../../../selectors/iteration-matrix/userManagementAdmin.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  userManagementAdminHelpers,
  userManagementAdminSelectors
};
