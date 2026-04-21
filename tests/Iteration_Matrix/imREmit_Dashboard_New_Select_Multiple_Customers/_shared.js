const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardNewSelectMultipleCustomersHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardNewSelectMultipleCustomers.js');
const { imremitDashboardNewSelectMultipleCustomersSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardNewSelectMultipleCustomers.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardNewSelectMultipleCustomersHelpers,
  imremitDashboardNewSelectMultipleCustomersSelectors
};
