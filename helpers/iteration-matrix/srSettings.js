const { srSettingsSelectors } = require('../../selectors/iteration-matrix/srSettings.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  srSettingsHelpers: {
    openModule,
    selectors: srSettingsSelectors
  }
};
