const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardPayablesPendingForMoreThan5DaysNewHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardPayablesPendingForMoreThan5DaysNew.js');
const { imremitDashboardPayablesPendingForMoreThan5DaysNewSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardPayablesPendingForMoreThan5DaysNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardPayablesPendingForMoreThan5DaysNewHelpers,
  imremitDashboardPayablesPendingForMoreThan5DaysNewSelectors
};
