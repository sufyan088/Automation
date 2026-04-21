const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardPayablesPendingForMoreThan5Days.js');
const { imremitLiteDashboardPayablesPendingForMoreThan5DaysSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardPayablesPendingForMoreThan5Days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers,
  imremitLiteDashboardPayablesPendingForMoreThan5DaysSelectors
};
