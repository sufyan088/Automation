const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { srDashboardHelpers } = require('../../../helpers/iteration-matrix/srDashboard.js');
const { srDashboardSelectors } = require('../../../selectors/iteration-matrix/srDashboard.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  srDashboardHelpers,
  srDashboardSelectors
};
