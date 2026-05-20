const { expect, test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { runnerConfigurationHelpers } = require('../../../helpers/iteration-matrix/runnerConfiguration.js');
const { runnerConfigurationSelectors } = require('../../../selectors/iteration-matrix/runnerConfiguration.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  expect,
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  runnerConfigurationHelpers,
  runnerConfigurationSelectors
};
