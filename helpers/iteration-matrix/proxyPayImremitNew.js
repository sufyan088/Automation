const { proxyPayImremitNewSelectors } = require('../../selectors/iteration-matrix/proxyPayImremitNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  proxyPayImremitNewHelpers: {
    openModule,
    selectors: proxyPayImremitNewSelectors
  }
};
