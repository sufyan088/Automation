const { statementSearchSelectors } = require('../../selectors/iteration-matrix/statementSearch.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  statementSearchHelpers: {
    openModule,
    selectors: statementSearchSelectors
  }
};
