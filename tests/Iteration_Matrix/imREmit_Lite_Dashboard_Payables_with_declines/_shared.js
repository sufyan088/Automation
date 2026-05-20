const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardPayablesWithDeclinesHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardPayablesWithDeclines.js');
const { imremitLiteDashboardPayablesWithDeclinesSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardPayablesWithDeclines.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardPayablesWithDeclinesHelpers,
  imremitLiteDashboardPayablesWithDeclinesSelectors
};
