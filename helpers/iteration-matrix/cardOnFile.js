const { cardOnFileSelectors } = require('../../selectors/iteration-matrix/cardOnFile.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  cardOnFileHelpers: {
    openModule,
    selectors: cardOnFileSelectors
  }
};
