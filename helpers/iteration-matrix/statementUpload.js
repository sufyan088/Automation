const { statementUploadSelectors } = require('../../selectors/iteration-matrix/statementUpload.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  statementUploadHelpers: {
    openModule,
    selectors: statementUploadSelectors
  }
};
