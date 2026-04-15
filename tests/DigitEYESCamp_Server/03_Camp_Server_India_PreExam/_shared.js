const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/source-aiq2/dataLoader');
const { loginAsAdmin } = require('../../../helpers/source-aiq2/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { campServerIndiaPreexamHelpers } = require('../../../helpers/source-aiq2/campServerIndiaPreexam');
const { campServerIndiaPreexamSelectors } = require('../../../selectors/source-aiq2/campServerIndiaPreexam.selectors');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaPreexamHelpers,
  campServerIndiaPreexamSelectors
};
