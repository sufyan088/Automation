const { imremitLiteDashboardEscalationWithBankSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardEscalationWithBank.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardEscalationWithBankHelpers: {
    openModule,
    selectors: imremitLiteDashboardEscalationWithBankSelectors
  }
};
