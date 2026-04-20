const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyescampsManagecampsclusterHelpers } = require('../../../helpers/digiteyescampsManagecampscluster.js');
const { digiteyescampsManagecampsclusterSelectors } = require('../../../selectors/digiteyescampsManagecampscluster.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
};
