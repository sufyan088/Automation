const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/iteration-matrix/dataLoader');
const { loginAsAdmin, loginAsRole } = require('../../../helpers/iteration-matrix/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { cardOnFileHelpers } = require('../../../helpers/iteration-matrix/cardOnFile.js');
const { cardOnFileSelectors } = require('../../../selectors/iteration-matrix/cardOnFile.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  test,
  loadRuntimeData,
  loginAsAdmin,
  loginAsRole,
  closeSession,
  cardOnFileHelpers,
  cardOnFileSelectors
};
