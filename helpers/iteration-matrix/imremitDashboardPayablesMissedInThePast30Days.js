const { imremitDashboardPayablesMissedInThePast30DaysSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesMissedInThePast30Days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardPayablesMissedInThePast30DaysHelpers: {
    openModule,
    selectors: imremitDashboardPayablesMissedInThePast30DaysSelectors
  }
};
