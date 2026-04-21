const { imremitLiteDashboardSupplierIsInactiveNewModuleSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardSupplierIsInactiveNewModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardSupplierIsInactiveNewModuleHelpers: {
    openModule,
    selectors: imremitLiteDashboardSupplierIsInactiveNewModuleSelectors
  }
};
