const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { srReportingNewHelpers } = require('../../../helpers/iteration-matrix/srReportingNew.js');
const { srReportingNewSelectors } = require('../../../selectors/iteration-matrix/srReportingNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  srReportingNewHelpers,
  srReportingNewSelectors
};
