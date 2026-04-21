const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitDashboardNewBankReconciliationFileNotReceivedHelpers } = require('../../../helpers/iteration-matrix/imremitDashboardNewBankReconciliationFileNotReceived.js');
const { imremitDashboardNewBankReconciliationFileNotReceivedSelectors } = require('../../../selectors/iteration-matrix/imremitDashboardNewBankReconciliationFileNotReceived.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitDashboardNewBankReconciliationFileNotReceivedHelpers,
  imremitDashboardNewBankReconciliationFileNotReceivedSelectors
};
