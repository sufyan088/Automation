const { imremitLiteDashboardDashboardFiltersSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardDashboardFilters.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardDashboardFiltersHelpers: {
    openModule,
    selectors: imremitLiteDashboardDashboardFiltersSelectors
  }
};
