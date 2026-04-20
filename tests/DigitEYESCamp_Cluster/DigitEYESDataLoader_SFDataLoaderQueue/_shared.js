const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesdataloaderSfdataloaderqueueHelpers } = require('../../../helpers/digiteyesdataloaderSfdataloaderqueue.js');
const { digiteyesdataloaderSfdataloaderqueueSelectors } = require('../../../selectors/digiteyesdataloaderSfdataloaderqueue.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers,
  digiteyesdataloaderSfdataloaderqueueSelectors
};
