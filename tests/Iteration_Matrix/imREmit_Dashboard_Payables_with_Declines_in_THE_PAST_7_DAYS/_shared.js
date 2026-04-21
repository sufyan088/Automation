const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardPayablesWithDeclinesInThePast7DaysHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardPayablesWithDeclinesInThePast7Days.js');
const { imremitDashboardPayablesWithDeclinesInThePast7DaysSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardPayablesWithDeclinesInThePast7Days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardPayablesWithDeclinesInThePast7DaysHelpers,
  imremitDashboardPayablesWithDeclinesInThePast7DaysSelectors
};
