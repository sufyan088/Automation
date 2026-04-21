const { proxyPayImremitLiteNewSelectors } = require('../../selectors/iteration-matrix/proxyPayImremitLiteNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  proxyPayImremitLiteNewHelpers: {
    openModule,
    selectors: proxyPayImremitLiteNewSelectors
  }
};
