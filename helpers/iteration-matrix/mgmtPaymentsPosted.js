const { mgmtPaymentsPostedSelectors } = require('../../selectors/iteration-matrix/mgmtPaymentsPosted.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  mgmtPaymentsPostedHelpers: {
    openModule,
    selectors: mgmtPaymentsPostedSelectors
  }
};
