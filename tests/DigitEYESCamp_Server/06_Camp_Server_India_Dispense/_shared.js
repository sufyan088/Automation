const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/source-aiq2/dataLoader');
const { loginAsAdmin } = require('../../../helpers/source-aiq2/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { campServerIndiaDispenseHelpers } = require('../../../helpers/source-aiq2/campServerIndiaDispense');
const { campServerIndiaDispenseSelectors } = require('../../../selectors/source-aiq2/campServerIndiaDispense.selectors');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaDispenseHelpers,
  campServerIndiaDispenseSelectors
};
