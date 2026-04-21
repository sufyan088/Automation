const { imremitDashboardNewBankReconciliationFileNotReceivedSelectors } = require('../../selectors/iteration-matrix/imremitDashboardNewBankReconciliationFileNotReceived.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitDashboardNewBankReconciliationFileNotReceivedHelpers: {
    openModule,
    selectors: imremitDashboardNewBankReconciliationFileNotReceivedSelectors
  }
};
