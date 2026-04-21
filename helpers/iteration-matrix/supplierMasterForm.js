const { supplierMasterFormSelectors } = require('../../selectors/iteration-matrix/supplierMasterForm.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierMasterFormHelpers: {
    openModule,
    selectors: supplierMasterFormSelectors
  }
};
