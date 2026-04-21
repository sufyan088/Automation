const { remittanceManagementSelectors } = require('../../selectors/iteration-matrix/remittanceManagement.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  remittanceManagementHelpers: {
    openModule,
    selectors: remittanceManagementSelectors
  }
};
