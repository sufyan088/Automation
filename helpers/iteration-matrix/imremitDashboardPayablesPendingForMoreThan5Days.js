const { imremitDashboardPayablesPendingForMoreThan5DaysSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesPendingForMoreThan5Days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardPayablesPendingForMoreThan5DaysHelpers: {
    openModule,
    selectors: imremitDashboardPayablesPendingForMoreThan5DaysSelectors
  }
};
