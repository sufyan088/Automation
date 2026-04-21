const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { mgmtSupplierTransactionLossHelpers } = require('../../../helpers/iteration-matrix/mgmtSupplierTransactionLoss.js');
const { mgmtSupplierTransactionLossSelectors } = require('../../../selectors/iteration-matrix/mgmtSupplierTransactionLoss.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  mgmtSupplierTransactionLossHelpers,
  mgmtSupplierTransactionLossSelectors
};
