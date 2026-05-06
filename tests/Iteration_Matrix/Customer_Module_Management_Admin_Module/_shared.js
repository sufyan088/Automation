const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerModuleManagementAdminModuleHelpers } = require('../../../helpers/iteration-matrix/customerModuleManagementAdminModule.js');
const { customerModuleManagementAdminModuleSelectors } = require('../../../selectors/iteration-matrix/customerModuleManagementAdminModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerModuleManagementAdminModuleHelpers,
  customerModuleManagementAdminModuleSelectors
};
