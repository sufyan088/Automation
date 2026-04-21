const { imremitDashboardFailedPaymentsOnImImErrorSelectors } = require('../../selectors/iteration-matrix/imremitDashboardFailedPaymentsOnImImError.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardFailedPaymentsOnImImErrorHelpers: {
    openModule,
    selectors: imremitDashboardFailedPaymentsOnImImErrorSelectors
  }
};
