const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesdataloaderParticipantconsentsHelpers } = require('../../../helpers/digiteyesdataloaderParticipantconsents.js');
const { digiteyesdataloaderParticipantconsentsSelectors } = require('../../../selectors/digiteyesdataloaderParticipantconsents.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderParticipantconsentsHelpers,
  digiteyesdataloaderParticipantconsentsSelectors
};
