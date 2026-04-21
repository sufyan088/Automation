const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { paymentMangementHelpers } = require('../../../helpers/iteration-matrix/paymentMangement.js');
const { paymentMangementSelectors } = require('../../../selectors/iteration-matrix/paymentMangement.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  paymentMangementHelpers,
  paymentMangementSelectors
};
