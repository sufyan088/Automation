const { mgmtPaymentReceivedSelectors } = require('../../selectors/iteration-matrix/mgmtPaymentReceived.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  mgmtPaymentReceivedHelpers: {
    openModule,
    selectors: mgmtPaymentReceivedSelectors
  }
};
