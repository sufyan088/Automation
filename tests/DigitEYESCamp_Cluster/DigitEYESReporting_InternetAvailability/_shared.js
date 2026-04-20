const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesreportingInternetavailabilityHelpers } = require('../../../helpers/digiteyesreportingInternetavailability.js');
const { digiteyesreportingInternetavailabilitySelectors } = require('../../../selectors/digiteyesreportingInternetavailability.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingInternetavailabilityHelpers,
  digiteyesreportingInternetavailabilitySelectors
};
