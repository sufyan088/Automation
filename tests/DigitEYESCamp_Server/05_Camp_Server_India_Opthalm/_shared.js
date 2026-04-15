const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/source-aiq2/dataLoader');
const { loginAsAdmin } = require('../../../helpers/source-aiq2/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { campServerIndiaOpthalmHelpers } = require('../../../helpers/source-aiq2/campServerIndiaOpthalm');
const { campServerIndiaOpthalmSelectors } = require('../../../selectors/source-aiq2/campServerIndiaOpthalm.selectors');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaOpthalmHelpers,
  campServerIndiaOpthalmSelectors
};
