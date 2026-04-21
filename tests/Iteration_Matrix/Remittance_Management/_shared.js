const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { remittanceManagementHelpers } = require('../../../helpers/iteration-matrix/remittanceManagement.js');
const { remittanceManagementSelectors } = require('../../../selectors/iteration-matrix/remittanceManagement.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  remittanceManagementHelpers,
  remittanceManagementSelectors
};
