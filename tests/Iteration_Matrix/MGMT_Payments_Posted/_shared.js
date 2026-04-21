const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { mgmtPaymentsPostedHelpers } = require('../../../helpers/iteration-matrix/mgmtPaymentsPosted.js');
const { mgmtPaymentsPostedSelectors } = require('../../../selectors/iteration-matrix/mgmtPaymentsPosted.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  mgmtPaymentsPostedHelpers,
  mgmtPaymentsPostedSelectors
};
