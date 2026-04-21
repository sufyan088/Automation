const { mgmtPercentageGrowthSelectors } = require('../../selectors/iteration-matrix/mgmtPercentageGrowth.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  mgmtPercentageGrowthHelpers: {
    openModule,
    selectors: mgmtPercentageGrowthSelectors
  }
};
