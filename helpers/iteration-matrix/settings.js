const { settingsSelectors } = require('../../selectors/iteration-matrix/settings.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  settingsHelpers: {
    openModule,
    selectors: settingsSelectors
  }
};
