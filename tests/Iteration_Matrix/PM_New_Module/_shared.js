const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, loginAsRole, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { pmNewModuleHelpers } = require('../../../helpers/iteration-matrix/pmNewModule.js');
const { pmNewModuleSelectors } = require('../../../selectors/iteration-matrix/pmNewModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  loginAsRole,
  closeSession,
  pmNewModuleHelpers,
  pmNewModuleSelectors
};
