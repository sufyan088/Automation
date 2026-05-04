const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerManagementAdminTwoHelpers } = require('../../../helpers/iteration-matrix/customerManagementAdminTwo.js');
const { customerManagementAdminTwoSelectors } = require('../../../selectors/iteration-matrix/customerManagementAdminTwo.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementAdminTwoHelpers,
  customerManagementAdminTwoSelectors
};
