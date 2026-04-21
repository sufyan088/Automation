const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { mgmtPaymentsPending5daysHelpers } = require('../../../helpers/iteration-matrix/mgmtPaymentsPending5days.js');
const { mgmtPaymentsPending5daysSelectors } = require('../../../selectors/iteration-matrix/mgmtPaymentsPending5days.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  mgmtPaymentsPending5daysHelpers,
  mgmtPaymentsPending5daysSelectors
};
