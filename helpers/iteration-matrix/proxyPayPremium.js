const { proxyPayPremiumSelectors } = require('../../selectors/iteration-matrix/proxyPayPremium.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  proxyPayPremiumHelpers: {
    openModule,
    selectors: proxyPayPremiumSelectors
  }
};
