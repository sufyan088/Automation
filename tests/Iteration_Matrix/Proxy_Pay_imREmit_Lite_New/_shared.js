const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { proxyPayImremitLiteNewHelpers } = require('../../../helpers/iteration-matrix/proxyPayImremitLiteNew.js');
const { proxyPayImremitLiteNewSelectors } = require('../../../selectors/iteration-matrix/proxyPayImremitLiteNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  proxyPayImremitLiteNewHelpers,
  proxyPayImremitLiteNewSelectors
};
