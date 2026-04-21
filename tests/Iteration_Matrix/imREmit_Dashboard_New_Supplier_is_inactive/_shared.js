const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardNewSupplierIsInactiveHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardNewSupplierIsInactive.js');
const { imremitDashboardNewSupplierIsInactiveSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardNewSupplierIsInactive.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardNewSupplierIsInactiveHelpers,
  imremitDashboardNewSupplierIsInactiveSelectors
};
