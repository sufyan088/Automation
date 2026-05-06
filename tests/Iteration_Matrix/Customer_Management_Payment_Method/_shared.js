const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerManagementPaymentMethodHelpers } = require('../../../helpers/iteration-matrix/customerManagementPaymentMethod.js');
const { customerManagementPaymentMethodSelectors } = require('../../../selectors/iteration-matrix/customerManagementPaymentMethod.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerManagementPaymentMethodHelpers,
  customerManagementPaymentMethodSelectors
};
