const { test } = require('@playwright/test');
const { loadRuntimeData } = require('../../../helpers/dataLoader');
const { loginAsAdmin, logout } = require('../../../helpers/auth');
const { registerModuleSuite } = require('../../../helpers/allureHierarchy');
const { digiteyessettingsCountrysettingsHelpers } = require('../../../helpers/digiteyessettingsCountrysettings.js');
const { digiteyessettingsCountrysettingsSelectors } = require('../../../selectors/digiteyessettingsCountrysettings.selectors.js');

registerModuleSuite(test, __dirname);

async function closeSession(page) {
  return page;
}

module.exports = {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsCountrysettingsHelpers,
  digiteyessettingsCountrysettingsSelectors
};
