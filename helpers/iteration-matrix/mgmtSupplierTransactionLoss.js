const { mgmtSupplierTransactionLossSelectors } = require('../../selectors/iteration-matrix/mgmtSupplierTransactionLoss.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  mgmtSupplierTransactionLossHelpers: {
    openModule,
    selectors: mgmtSupplierTransactionLossSelectors
  }
};
