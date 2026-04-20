const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesreportingCamptrendsHelpers } = require('../../../helpers/digiteyesreportingCamptrends.js');
const { digiteyesreportingCamptrendsSelectors } = require('../../../selectors/digiteyesreportingCamptrends.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingCamptrendsHelpers,
  digiteyesreportingCamptrendsSelectors
};
