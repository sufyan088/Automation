const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/source-aiq2/dataLoader');
const { loginAsAdmin } = require('../../../helpers/source-aiq2/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { campServerIndiaPrescreeningHelpers } = require('../../../helpers/source-aiq2/campServerIndiaPrescreening');
const { campServerIndiaPrescreeningSelectors } = require('../../../selectors/source-aiq2/campServerIndiaPrescreening.selectors');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaPrescreeningHelpers,
  campServerIndiaPrescreeningSelectors
};
