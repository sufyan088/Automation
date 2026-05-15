const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, loginAsRole, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { srSearchNewModuleHelpers } = require('../../../helpers/iteration-matrix/srSearchNewModule.js');
const { srSearchNewModuleSelectors } = require('../../../selectors/iteration-matrix/srSearchNewModule.selectors.js');

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
  srSearchNewModuleHelpers,
  srSearchNewModuleSelectors
};
