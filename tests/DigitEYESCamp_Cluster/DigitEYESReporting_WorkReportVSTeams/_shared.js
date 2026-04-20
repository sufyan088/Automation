const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyesreportingWorkreportvsteamsHelpers } = require('../../../helpers/digiteyesreportingWorkreportvsteams.js');
const { digiteyesreportingWorkreportvsteamsSelectors } = require('../../../selectors/digiteyesreportingWorkreportvsteams.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportvsteamsHelpers,
  digiteyesreportingWorkreportvsteamsSelectors
};
