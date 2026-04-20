const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyessettingsHospitalsHelpers } = require('../../../helpers/digiteyessettingsHospitals.js');
const { digiteyessettingsHospitalsSelectors } = require('../../../selectors/digiteyessettingsHospitals.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers,
  digiteyessettingsHospitalsSelectors
};
