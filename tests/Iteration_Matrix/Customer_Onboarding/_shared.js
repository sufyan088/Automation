const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { customerOnboardingHelpers } = require('../../../helpers/iteration-matrix/customerOnboarding.js');
const { customerOnboardingSelectors } = require('../../../selectors/iteration-matrix/customerOnboarding.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  await logout(page);
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  customerOnboardingHelpers,
  customerOnboardingSelectors
};
