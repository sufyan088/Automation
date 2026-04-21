const { imremitDashboardPayablesEndingInTheNext7DaysSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesEndingInTheNext7Days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardPayablesEndingInTheNext7DaysHelpers: {
    openModule,
    selectors: imremitDashboardPayablesEndingInTheNext7DaysSelectors
  }
};
