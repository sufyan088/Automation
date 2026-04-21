const { customerOnboardingImremitLiteSelectors } = require('../../selectors/iteration-matrix/customerOnboardingImremitLite.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerOnboardingImremitLiteHelpers: {
    openModule,
    selectors: customerOnboardingImremitLiteSelectors
  }
};
