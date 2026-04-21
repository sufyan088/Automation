const { duplicateDashboardNewModuleSelectors } = require('../../selectors/iteration-matrix/duplicateDashboardNewModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  duplicateDashboardNewModuleHelpers: {
    openModule,
    selectors: duplicateDashboardNewModuleSelectors
  }
};
