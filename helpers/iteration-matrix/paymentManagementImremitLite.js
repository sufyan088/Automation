const { paymentManagementImremitLiteSelectors } = require('../../selectors/iteration-matrix/paymentManagementImremitLite.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  paymentManagementImremitLiteHelpers: {
    openModule,
    selectors: paymentManagementImremitLiteSelectors
  }
};
