const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { supplierManagementImremitPremiumHelpers } = require('../../../helpers/iteration-matrix/supplierManagementImremitPremium.js');
const { supplierManagementImremitPremiumSelectors } = require('../../../selectors/iteration-matrix/supplierManagementImremitPremium.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  supplierManagementImremitPremiumHelpers,
  supplierManagementImremitPremiumSelectors
};
