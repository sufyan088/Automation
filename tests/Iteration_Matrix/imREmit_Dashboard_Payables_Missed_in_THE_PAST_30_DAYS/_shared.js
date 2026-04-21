const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardPayablesMissedInThePast30Days.js');
const { imremitDashboardPayablesMissedInThePast30DaysSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardPayablesMissedInThePast30Days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardPayablesMissedInThePast30DaysHelpers,
  imremitDashboardPayablesMissedInThePast30DaysSelectors
};
