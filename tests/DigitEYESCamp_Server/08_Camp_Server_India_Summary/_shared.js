const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/source-aiq2/dataLoader');
const { loginAsAdmin } = require('../../../helpers/source-aiq2/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { campServerIndiaSummaryHelpers } = require('../../../helpers/source-aiq2/campServerIndiaSummary');
const { campServerIndiaSummarySelectors } = require('../../../selectors/source-aiq2/campServerIndiaSummary.selectors');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaSummaryHelpers,
  campServerIndiaSummarySelectors
};
