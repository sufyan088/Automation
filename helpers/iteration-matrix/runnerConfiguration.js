const { runnerConfigurationSelectors } = require('../../selectors/iteration-matrix/runnerConfiguration.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  runnerConfigurationHelpers: {
    openModule,
    selectors: runnerConfigurationSelectors
  }
};
