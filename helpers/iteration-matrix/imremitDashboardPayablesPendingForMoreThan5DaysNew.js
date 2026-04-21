const { imremitDashboardPayablesPendingForMoreThan5DaysNewSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesPendingForMoreThan5DaysNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardPayablesPendingForMoreThan5DaysNewHelpers: {
    openModule,
    selectors: imremitDashboardPayablesPendingForMoreThan5DaysNewSelectors
  }
};
