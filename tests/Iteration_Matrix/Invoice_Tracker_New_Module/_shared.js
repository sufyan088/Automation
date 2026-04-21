const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { invoiceTrackerNewModuleHelpers } = require('../../../helpers/iteration-matrix/invoiceTrackerNewModule.js');
const { invoiceTrackerNewModuleSelectors } = require('../../../selectors/iteration-matrix/invoiceTrackerNewModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  invoiceTrackerNewModuleHelpers,
  invoiceTrackerNewModuleSelectors
};
