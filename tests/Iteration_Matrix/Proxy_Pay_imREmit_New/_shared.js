const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { proxyPayImremitNewHelpers } = require('../../../helpers/iteration-matrix/proxyPayImremitNew.js');
const { proxyPayImremitNewSelectors } = require('../../../selectors/iteration-matrix/proxyPayImremitNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  proxyPayImremitNewHelpers,
  proxyPayImremitNewSelectors
};
