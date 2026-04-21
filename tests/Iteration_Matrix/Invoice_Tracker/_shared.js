const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { invoiceTrackerHelpers } = require('../../../helpers/iteration-matrix/invoiceTracker.js');
const { invoiceTrackerSelectors } = require('../../../selectors/iteration-matrix/invoiceTracker.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  invoiceTrackerHelpers,
  invoiceTrackerSelectors
};
