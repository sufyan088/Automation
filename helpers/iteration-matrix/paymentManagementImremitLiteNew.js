const { paymentManagementImremitLiteNewSelectors } = require('../../selectors/iteration-matrix/paymentManagementImremitLiteNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  paymentManagementImremitLiteNewHelpers: {
    openModule,
    selectors: paymentManagementImremitLiteNewSelectors
  }
};
