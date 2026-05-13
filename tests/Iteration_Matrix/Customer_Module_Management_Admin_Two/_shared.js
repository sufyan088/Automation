const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerModuleManagementAdminTwoHelpers } = require('../../../helpers/iteration-matrix/customerModuleManagementAdminTwo.js');
const { customerModuleManagementAdminTwoSelectors } = require('../../../selectors/iteration-matrix/customerModuleManagementAdminTwo.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerModuleManagementAdminTwoHelpers,
  customerModuleManagementAdminTwoSelectors
};
