const { paymentManagementImremitSelectors } = require('../../selectors/iteration-matrix/paymentManagementImremit.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  paymentManagementImremitHelpers: {
    openModule,
    selectors: paymentManagementImremitSelectors
  }
};
