const { imremitDashboardNewSelectMultipleCustomersSelectors } = require('../../selectors/iteration-matrix/imremitDashboardNewSelectMultipleCustomers.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardNewSelectMultipleCustomersHelpers: {
    openModule,
    selectors: imremitDashboardNewSelectMultipleCustomersSelectors
  }
};
