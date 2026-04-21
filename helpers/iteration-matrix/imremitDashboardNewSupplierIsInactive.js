const { imremitDashboardNewSupplierIsInactiveSelectors } = require('../../selectors/iteration-matrix/imremitDashboardNewSupplierIsInactive.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardNewSupplierIsInactiveHelpers: {
    openModule,
    selectors: imremitDashboardNewSupplierIsInactiveSelectors
  }
};
