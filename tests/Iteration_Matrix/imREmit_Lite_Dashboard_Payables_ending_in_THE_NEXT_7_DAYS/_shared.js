const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardPayablesEndingInTheNext7DaysHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardPayablesEndingInTheNext7Days.js');
const { imremitLiteDashboardPayablesEndingInTheNext7DaysSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardPayablesEndingInTheNext7Days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardPayablesEndingInTheNext7DaysHelpers,
  imremitLiteDashboardPayablesEndingInTheNext7DaysSelectors
};
