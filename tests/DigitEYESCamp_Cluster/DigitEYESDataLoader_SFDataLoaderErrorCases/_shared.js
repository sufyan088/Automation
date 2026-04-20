const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesdataloaderSfdataloadererrorcasesHelpers } = require('../../../helpers/digiteyesdataloaderSfdataloadererrorcases.js');
const { digiteyesdataloaderSfdataloadererrorcasesSelectors } = require('../../../selectors/digiteyesdataloaderSfdataloadererrorcases.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers,
  digiteyesdataloaderSfdataloadererrorcasesSelectors
};
