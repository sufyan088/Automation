const { proxyPayDashboardImremitLiteNewSelectors } = require('../../selectors/iteration-matrix/proxyPayDashboardImremitLiteNew.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  proxyPayDashboardImremitLiteNewHelpers: {
    openModule,
    selectors: proxyPayDashboardImremitLiteNewSelectors
  }
};
