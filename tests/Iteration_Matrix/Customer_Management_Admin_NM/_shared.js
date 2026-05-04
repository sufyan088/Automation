const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, loginAsRole } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerManagementAdminNmHelpers } = require('../../../helpers/iteration-matrix/customerManagementAdminNm.js');
const { customerManagementAdminNmSelectors } = require('../../../selectors/iteration-matrix/customerManagementAdminNm.selectors.js');

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
  customerManagementAdminNmHelpers,
  customerManagementAdminNmSelectors
};
