const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerManagementAdminHelpers } = require('../../../helpers/iteration-matrix/customerManagementAdmin.js');
const { customerManagementAdminSelectors } = require('../../../selectors/iteration-matrix/customerManagementAdmin.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminHelpers,
  customerManagementAdminSelectors
};
