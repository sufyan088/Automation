const { imremitLiteDashboardPayablesPendingForMoreThan5DaysSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardPayablesPendingForMoreThan5Days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers: {
    openModule,
    selectors: imremitLiteDashboardPayablesPendingForMoreThan5DaysSelectors
  }
};
