const { pmNewModuleSelectors } = require('../../selectors/iteration-matrix/pmNewModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  pmNewModuleHelpers: {
    openModule,
    selectors: pmNewModuleSelectors
  }
};
