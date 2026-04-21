const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { proxypayImremitMoudleHelpers } = require('../../../helpers/iteration-matrix/proxypayImremitMoudle.js');
const { proxypayImremitMoudleSelectors } = require('../../../selectors/iteration-matrix/proxypayImremitMoudle.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  proxypayImremitMoudleHelpers,
  proxypayImremitMoudleSelectors
};
