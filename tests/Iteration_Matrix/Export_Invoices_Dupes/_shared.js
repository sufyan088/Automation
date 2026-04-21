const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { exportInvoicesDupesHelpers } = require('../../../helpers/iteration-matrix/exportInvoicesDupes.js');
const { exportInvoicesDupesSelectors } = require('../../../selectors/iteration-matrix/exportInvoicesDupes.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  exportInvoicesDupesHelpers,
  exportInvoicesDupesSelectors
};
