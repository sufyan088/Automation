const { imremitMappingSelectors } = require('../../selectors/iteration-matrix/imremitMapping.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitMappingHelpers: {
    openModule,
    selectors: imremitMappingSelectors
  }
};
