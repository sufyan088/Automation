const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { duplicateDashboardNewModuleHelpers } = require('../../../helpers/iteration-matrix/duplicateDashboardNewModule.js');
const { duplicateDashboardNewModuleSelectors } = require('../../../selectors/iteration-matrix/duplicateDashboardNewModule.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  duplicateDashboardNewModuleHelpers,
  duplicateDashboardNewModuleSelectors
};
