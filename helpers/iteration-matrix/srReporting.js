const { srReportingSelectors } = require('../../selectors/iteration-matrix/srReporting.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  srReportingHelpers: {
    openModule,
    selectors: srReportingSelectors
  }
};
