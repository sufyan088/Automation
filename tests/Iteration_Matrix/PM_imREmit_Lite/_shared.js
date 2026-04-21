const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { pmImremitLiteHelpers } = require('../../../helpers/iteration-matrix/pmImremitLite.js');
const { pmImremitLiteSelectors } = require('../../../selectors/iteration-matrix/pmImremitLite.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  pmImremitLiteHelpers,
  pmImremitLiteSelectors
};
