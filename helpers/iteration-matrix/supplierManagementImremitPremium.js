const { supplierManagementImremitPremiumSelectors } = require('../../selectors/iteration-matrix/supplierManagementImremitPremium.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierManagementImremitPremiumHelpers: {
    openModule,
    selectors: supplierManagementImremitPremiumSelectors
  }
};
