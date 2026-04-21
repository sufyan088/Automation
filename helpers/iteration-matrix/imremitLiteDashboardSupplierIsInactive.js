const { imremitLiteDashboardSupplierIsInactiveSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardSupplierIsInactive.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardSupplierIsInactiveHelpers: {
    openModule,
    selectors: imremitLiteDashboardSupplierIsInactiveSelectors
  }
};
