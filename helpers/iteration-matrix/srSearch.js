const { srSearchSelectors } = require('../../selectors/iteration-matrix/srSearch.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  srSearchHelpers: {
    openModule,
    selectors: srSearchSelectors
  }
};
