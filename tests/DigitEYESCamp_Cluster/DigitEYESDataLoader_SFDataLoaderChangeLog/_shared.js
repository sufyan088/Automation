const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesdataloaderSfdataloaderchangelogHelpers } = require('../../../helpers/digiteyesdataloaderSfdataloaderchangelog.js');
const { digiteyesdataloaderSfdataloaderchangelogSelectors } = require('../../../selectors/digiteyesdataloaderSfdataloaderchangelog.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderchangelogHelpers,
  digiteyesdataloaderSfdataloaderchangelogSelectors
};
