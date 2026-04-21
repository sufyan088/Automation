const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardDashboardFiltersHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardDashboardFilters.js');
const { imremitLiteDashboardDashboardFiltersSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardDashboardFilters.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardDashboardFiltersHelpers,
  imremitLiteDashboardDashboardFiltersSelectors
};
