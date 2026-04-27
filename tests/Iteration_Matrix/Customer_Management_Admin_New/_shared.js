const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, loginAsRole } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerManagementAdminNewHelpers } = require('../../../helpers/iteration-matrix/customerManagementAdminNew.js');
const { customerManagementAdminNewSelectors } = require('../../../selectors/iteration-matrix/customerManagementAdminNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  loginAsRole,
  closeSession,
  customerManagementAdminNewHelpers,
  customerManagementAdminNewSelectors
};
