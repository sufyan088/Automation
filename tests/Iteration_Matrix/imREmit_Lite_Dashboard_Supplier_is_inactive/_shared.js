const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardSupplierIsInactiveHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardSupplierIsInactive.js');
const { imremitLiteDashboardSupplierIsInactiveSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardSupplierIsInactive.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardSupplierIsInactiveHelpers,
  imremitLiteDashboardSupplierIsInactiveSelectors
};
