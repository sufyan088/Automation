const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesreportingSummarysheetdataHelpers } = require('../../../helpers/digiteyesreportingSummarysheetdata.js');
const { digiteyesreportingSummarysheetdataSelectors } = require('../../../selectors/digiteyesreportingSummarysheetdata.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingSummarysheetdataHelpers,
  digiteyesreportingSummarysheetdataSelectors
};
