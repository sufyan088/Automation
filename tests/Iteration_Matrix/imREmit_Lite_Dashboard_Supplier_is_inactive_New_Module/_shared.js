const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardSupplierIsInactiveNewModuleHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardSupplierIsInactiveNewModule.js');
const { imremitLiteDashboardSupplierIsInactiveNewModuleSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardSupplierIsInactiveNewModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardSupplierIsInactiveNewModuleHelpers,
  imremitLiteDashboardSupplierIsInactiveNewModuleSelectors
};
