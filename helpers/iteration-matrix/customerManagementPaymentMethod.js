const { customerManagementPaymentMethodSelectors } = require('../../selectors/iteration-matrix/customerManagementPaymentMethod.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerManagementPaymentMethodHelpers: {
    openModule,
    selectors: customerManagementPaymentMethodSelectors
  }
};
