const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { criteriaSettingsNewModuleHelpers } = require('../../../helpers/iteration-matrix/criteriaSettingsNewModule.js');
const { criteriaSettingsNewModuleSelectors } = require('../../../selectors/iteration-matrix/criteriaSettingsNewModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  criteriaSettingsNewModuleHelpers,
  criteriaSettingsNewModuleSelectors
};
