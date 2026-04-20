const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyessettingsDesalesforcefieldmappingHelpers } = require('../../../helpers/digiteyessettingsDesalesforcefieldmapping.js');
const { digiteyessettingsDesalesforcefieldmappingSelectors } = require('../../../selectors/digiteyessettingsDesalesforcefieldmapping.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsDesalesforcefieldmappingHelpers,
  digiteyessettingsDesalesforcefieldmappingSelectors
};
