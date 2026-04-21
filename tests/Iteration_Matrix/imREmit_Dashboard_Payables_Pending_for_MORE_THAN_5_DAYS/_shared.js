const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardPayablesPendingForMoreThan5DaysHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardPayablesPendingForMoreThan5Days.js');
const { imremitDashboardPayablesPendingForMoreThan5DaysSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardPayablesPendingForMoreThan5Days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardPayablesPendingForMoreThan5DaysHelpers,
  imremitDashboardPayablesPendingForMoreThan5DaysSelectors
};
