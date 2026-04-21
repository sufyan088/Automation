const { srReportingNewSelectors } = require('../../selectors/iteration-matrix/srReportingNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  srReportingNewHelpers: {
    openModule,
    selectors: srReportingNewSelectors
  }
};
