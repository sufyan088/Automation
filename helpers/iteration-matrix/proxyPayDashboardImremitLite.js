const { proxyPayDashboardImremitLiteSelectors } = require('../../selectors/iteration-matrix/proxyPayDashboardImremitLite.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  proxyPayDashboardImremitLiteHelpers: {
    openModule,
    selectors: proxyPayDashboardImremitLiteSelectors
  }
};
