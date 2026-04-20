const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesreportingWorkreportipteamsHelpers } = require('../../../helpers/digiteyesreportingWorkreportipteams.js');
const { digiteyesreportingWorkreportipteamsSelectors } = require('../../../selectors/digiteyesreportingWorkreportipteams.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportipteamsHelpers,
  digiteyesreportingWorkreportipteamsSelectors
};
