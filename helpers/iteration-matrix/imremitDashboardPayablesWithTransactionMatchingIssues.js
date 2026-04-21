const { imremitDashboardPayablesWithTransactionMatchingIssuesSelectors } = require('../../selectors/iteration-matrix/imremitDashboardPayablesWithTransactionMatchingIssues.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardPayablesWithTransactionMatchingIssuesHelpers: {
    openModule,
    selectors: imremitDashboardPayablesWithTransactionMatchingIssuesSelectors
  }
};
