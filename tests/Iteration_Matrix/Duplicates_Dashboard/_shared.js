const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { duplicatesDashboardHelpers } = require('../../../helpers/iteration-matrix/duplicatesDashboard.js');
const { duplicatesDashboardSelectors } = require('../../../selectors/iteration-matrix/duplicatesDashboard.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  duplicatesDashboardHelpers,
  duplicatesDashboardSelectors
};
