const { customerOnboardingSelectors } = require('../../selectors/iteration-matrix/customerOnboarding.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  customerOnboardingHelpers: {
    openModule,
    selectors: customerOnboardingSelectors
  }
};
