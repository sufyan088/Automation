const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyescampsDataforsalesforceHelpers } = require('../../../helpers/digiteyescampsDataforsalesforce.js');
const { digiteyescampsDataforsalesforceSelectors } = require('../../../selectors/digiteyescampsDataforsalesforce.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers,
  digiteyescampsDataforsalesforceSelectors
};
