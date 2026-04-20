const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyescampsParticipantsHelpers } = require('../../../helpers/digiteyescampsParticipants.js');
const { digiteyescampsParticipantsSelectors } = require('../../../selectors/digiteyescampsParticipants.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsParticipantsHelpers,
  digiteyescampsParticipantsSelectors
};
