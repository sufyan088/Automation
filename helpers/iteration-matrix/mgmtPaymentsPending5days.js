const { mgmtPaymentsPending5daysSelectors } = require('../../selectors/iteration-matrix/mgmtPaymentsPending5days.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  mgmtPaymentsPending5daysHelpers: {
    openModule,
    selectors: mgmtPaymentsPending5daysSelectors
  }
};
