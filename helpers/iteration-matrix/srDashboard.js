const { srDashboardSelectors } = require('../../selectors/iteration-matrix/srDashboard.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  srDashboardHelpers: {
    openModule,
    selectors: srDashboardSelectors
  }
};
