const { imremitLiteDashboardPayablesWithDeclinesSelectors } = require('../../selectors/iteration-matrix/imremitLiteDashboardPayablesWithDeclines.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  imremitLiteDashboardPayablesWithDeclinesHelpers: {
    openModule,
    selectors: imremitLiteDashboardPayablesWithDeclinesSelectors
  }
};
