const { imremitDashboardPayablesWithDeclinesInThePast7DaysSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesWithDeclinesInThePast7Days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardPayablesWithDeclinesInThePast7DaysHelpers: {
    openModule,
    selectors: imremitDashboardPayablesWithDeclinesInThePast7DaysSelectors
  }
};
