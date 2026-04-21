const { invoiceTrackerNewModuleSelectors } = require('../../selectors/iteration-matrix/invoiceTrackerNewModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  invoiceTrackerNewModuleHelpers: {
    openModule,
    selectors: invoiceTrackerNewModuleSelectors
  }
};
