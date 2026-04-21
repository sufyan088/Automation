const { duplicatesTrackerSelectors } = require('../../selectors/iteration-matrix/duplicatesTracker.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  duplicatesTrackerHelpers: {
    openModule,
    selectors: duplicatesTrackerSelectors
  }
};
