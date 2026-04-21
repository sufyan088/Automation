const { invoicesMappingSelectors } = require('../../selectors/iteration-matrix/invoicesMapping.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  invoicesMappingHelpers: {
    openModule,
    selectors: invoicesMappingSelectors
  }
};
