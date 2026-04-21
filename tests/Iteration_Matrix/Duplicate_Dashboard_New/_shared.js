const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { duplicateDashboardNewHelpers } = require('../../../helpers/iteration-matrix/duplicateDashboardNew.js');
const { duplicateDashboardNewSelectors } = require('../../../selectors/iteration-matrix/duplicateDashboardNew.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  duplicateDashboardNewHelpers,
  duplicateDashboardNewSelectors
};
