const { invoiceTrackerModuleSelectors } = require('../../selectors/iteration-matrix/invoiceTrackerModule.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  invoiceTrackerModuleHelpers: {
    openModule,
    selectors: invoiceTrackerModuleSelectors
  }
};
