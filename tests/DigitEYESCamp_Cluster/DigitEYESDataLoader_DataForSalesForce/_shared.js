const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesdataloaderDataforsalesforceHelpers } = require('../../../helpers/digiteyesdataloaderDataforsalesforce.js');
const { digiteyesdataloaderDataforsalesforceSelectors } = require('../../../selectors/digiteyesdataloaderDataforsalesforce.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers,
  digiteyesdataloaderDataforsalesforceSelectors
};
