const { invoiceTrackerSelectors } = require('../../selectors/iteration-matrix/invoiceTracker.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  invoiceTrackerHelpers: {
    openModule,
    selectors: invoiceTrackerSelectors
  }
};
