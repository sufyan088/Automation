const { mgmtInformationSystemSelectors } = require('../../selectors/iteration-matrix/mgmtInformationSystem.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  mgmtInformationSystemHelpers: {
    openModule,
    selectors: mgmtInformationSystemSelectors
  }
};
