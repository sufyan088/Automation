const { proxypayImremitMoudleSelectors } = require('../../selectors/iteration-matrix/proxypayImremitMoudle.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  proxypayImremitMoudleHelpers: {
    openModule,
    selectors: proxypayImremitMoudleSelectors
  }
};
