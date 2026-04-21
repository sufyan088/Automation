const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerModuleManagementAdminModuleNewHelpers } = require('../../../helpers/iteration-matrix/customerModuleManagementAdminModuleNew.js');
const { customerModuleManagementAdminModuleNewSelectors } = require('../../../selectors/iteration-matrix/customerModuleManagementAdminModuleNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerModuleManagementAdminModuleNewHelpers,
  customerModuleManagementAdminModuleNewSelectors
};
