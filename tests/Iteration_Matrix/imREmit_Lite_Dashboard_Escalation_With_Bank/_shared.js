const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitLiteDashboardEscalationWithBankHelpers } = require('../../../helpers/iteration-matrix/imremitLiteDashboardEscalationWithBank.js');
const { imremitLiteDashboardEscalationWithBankSelectors } = require('../../../selectors/iteration-matrix/imremitLiteDashboardEscalationWithBank.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitLiteDashboardEscalationWithBankHelpers,
  imremitLiteDashboardEscalationWithBankSelectors
};
