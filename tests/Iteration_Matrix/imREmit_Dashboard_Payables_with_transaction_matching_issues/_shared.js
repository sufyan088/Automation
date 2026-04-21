const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardPayablesWithTransactionMatchingIssuesHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardPayablesWithTransactionMatchingIssues.js');
const { imremitDashboardPayablesWithTransactionMatchingIssuesSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardPayablesWithTransactionMatchingIssues.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardPayablesWithTransactionMatchingIssuesHelpers,
  imremitDashboardPayablesWithTransactionMatchingIssuesSelectors
};
