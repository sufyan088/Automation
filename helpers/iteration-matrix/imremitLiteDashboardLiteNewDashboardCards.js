const { imremitLiteDashboardLiteNewDashboardCardsSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardLiteNewDashboardCards.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardLiteNewDashboardCardsHelpers: {
    openModule,
    selectors: imremitLiteDashboardLiteNewDashboardCardsSelectors
  }
};
