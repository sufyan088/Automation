const { srSearchNewModuleSelectors } = require('../../selectors/iteration-matrix/srSearchNewModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  srSearchNewModuleHelpers: {
    openModule,
    selectors: srSearchNewModuleSelectors
  }
};
