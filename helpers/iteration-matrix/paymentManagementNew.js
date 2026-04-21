const { paymentManagementNewSelectors } = require('../../selectors/iteration-matrix/paymentManagementNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  paymentManagementNewHelpers: {
    openModule,
    selectors: paymentManagementNewSelectors
  }
};
