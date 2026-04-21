const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { imremitMappingHelpers } = require('../../../helpers/iteration-matrix/imremitMapping.js');
const { imremitMappingSelectors } = require('../../../selectors/iteration-matrix/imremitMapping.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  imremitMappingHelpers,
  imremitMappingSelectors
};
