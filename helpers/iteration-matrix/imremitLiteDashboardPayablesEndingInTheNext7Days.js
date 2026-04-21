const { imremitLiteDashboardPayablesEndingInTheNext7DaysSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardPayablesEndingInTheNext7Days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardPayablesEndingInTheNext7DaysHelpers: {
    openModule,
    selectors: imremitLiteDashboardPayablesEndingInTheNext7DaysSelectors
  }
};
