const { duplicatesDashboardSelectors } = require('../../selectors/iteration-matrix/duplicatesDashboard.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  duplicatesDashboardHelpers: {
    openModule,
    selectors: duplicatesDashboardSelectors
  }
};
