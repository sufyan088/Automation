const { supplierMasterListNewSelectors } = require('../../selectors/iteration-matrix/supplierMasterListNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierMasterListNewHelpers: {
    openModule,
    selectors: supplierMasterListNewSelectors
  }
};
