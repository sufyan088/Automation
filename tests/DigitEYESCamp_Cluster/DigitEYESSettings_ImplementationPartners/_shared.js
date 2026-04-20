const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyessettingsImplementationpartnersHelpers } = require('../../../helpers/digiteyessettingsImplementationpartners.js');
const { digiteyessettingsImplementationpartnersSelectors } = require('../../../selectors/digiteyessettingsImplementationpartners.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsImplementationpartnersHelpers,
  digiteyessettingsImplementationpartnersSelectors
};
