const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { srReportingHelpers } = require('../../../helpers/iteration-matrix/srReporting.js');
const { srReportingSelectors } = require('../../../selectors/iteration-matrix/srReporting.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  srReportingHelpers,
  srReportingSelectors
};
