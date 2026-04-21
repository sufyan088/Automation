const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardPayablesEndingInTheNext7Days.js');
const { imremitDashboardPayablesEndingInTheNext7DaysSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardPayablesEndingInTheNext7Days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardPayablesEndingInTheNext7DaysHelpers,
  imremitDashboardPayablesEndingInTheNext7DaysSelectors
};
