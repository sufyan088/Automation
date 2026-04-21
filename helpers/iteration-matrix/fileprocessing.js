const { fileprocessingSelectors } = require('../../selectors/iteration-matrix/fileprocessing.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  fileprocessingHelpers: {
    openModule,
    selectors: fileprocessingSelectors
  }
};
