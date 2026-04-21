const { pmImremitLiteSelectors } = require('../../selectors/iteration-matrix/pmImremitLite.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  pmImremitLiteHelpers: {
    openModule,
    selectors: pmImremitLiteSelectors
  }
};
