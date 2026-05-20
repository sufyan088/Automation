const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin: loginAsAdminBase, logout } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { srDashboardHelpers } = require('../../../helpers/iteration-matrix/srDashboard.js');
const { srDashboardSelectors } = require('../../../selectors/iteration-matrix/srDashboard.selectors.js');

registerModuleSuite(test, __dirname);

function buildScenarioWorkflowTitle(scenarioTitle) {
  const readableTitle = String(scenarioTitle || '')
    .replace(/^TS_\d+_?/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return readableTitle
    ? `Run SR Dashboard workflow: ${readableTitle}`
    : 'Run SR Dashboard workflow';
}

async function loginAsAdmin(page, data) {
  if (srDashboardHelpers.requiresScenarioLogin(test.info().title)) {
    return;
  }

  return loginAsAdminBase(page, data);
}

async function closeSession(page) {
  await logout(page);
}

async function runConvertedFlow(page, data) {
  await test.step(buildScenarioWorkflowTitle(test.info().title), async () => {
    await srDashboardHelpers.runScenario(page, data, test.info().title);
  });
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  runConvertedFlow,
  srDashboardHelpers,
  srDashboardSelectors
};
