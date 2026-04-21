const { supplierMasterListSelectors } = require('../../selectors/iteration-matrix/supplierMasterList.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierMasterListHelpers: {
    openModule,
    selectors: supplierMasterListSelectors
  }
};
