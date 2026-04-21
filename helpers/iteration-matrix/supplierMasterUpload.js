const { supplierMasterUploadSelectors } = require('../../selectors/iteration-matrix/supplierMasterUpload.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  supplierMasterUploadHelpers: {
    openModule,
    selectors: supplierMasterUploadSelectors
  }
};
