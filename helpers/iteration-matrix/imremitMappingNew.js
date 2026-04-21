const { imremitMappingNewSelectors } = require('../../selectors/iteration-matrix/imremitMappingNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitMappingNewHelpers: {
    openModule,
    selectors: imremitMappingNewSelectors
  }
};
