const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { invoicesMappingHelpers } = require('../../../helpers/iteration-matrix/invoicesMapping.js');
const { invoicesMappingSelectors } = require('../../../selectors/iteration-matrix/invoicesMapping.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  invoicesMappingHelpers,
  invoicesMappingSelectors
};
