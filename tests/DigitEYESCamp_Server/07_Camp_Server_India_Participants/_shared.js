const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/source-aiq2/dataLoader');
const { loginAsAdmin } = require('../../../helpers/source-aiq2/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { campServerIndiaParticipantsHelpers } = require('../../../helpers/source-aiq2/campServerIndiaParticipants');
const { campServerIndiaParticipantsSelectors } = require('../../../selectors/source-aiq2/campServerIndiaParticipants.selectors');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaParticipantsHelpers,
  campServerIndiaParticipantsSelectors
};
