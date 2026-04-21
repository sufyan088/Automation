const { paymentMangementSelectors } = require('../../selectors/iteration-matrix/paymentMangement.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  paymentMangementHelpers: {
    openModule,
    selectors: paymentMangementSelectors
  }
};
