const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { duplicatesTrackerHelpers } = require('../../../helpers/iteration-matrix/duplicatesTracker.js');
const { duplicatesTrackerSelectors } = require('../../../selectors/iteration-matrix/duplicatesTracker.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  duplicatesTrackerHelpers,
  duplicatesTrackerSelectors
};
