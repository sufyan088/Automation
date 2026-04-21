const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardLiteNewDashboardCardsHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardLiteNewDashboardCards.js');
const { imremitLiteDashboardLiteNewDashboardCardsSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardLiteNewDashboardCards.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardLiteNewDashboardCardsHelpers,
  imremitLiteDashboardLiteNewDashboardCardsSelectors
};
