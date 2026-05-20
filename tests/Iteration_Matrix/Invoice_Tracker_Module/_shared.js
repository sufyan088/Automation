const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, loginAsRole, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { invoiceTrackerModuleHelpers } = require('../../../helpers/iteration-matrix/invoiceTrackerModule.js');
const { invoiceTrackerModuleSelectors } = require('../../../selectors/iteration-matrix/invoiceTrackerModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  loginAsRole,
  closeSession,
  invoiceTrackerModuleHelpers,
  invoiceTrackerModuleSelectors
};
