const { loginSelectors } = require('../../selectors/iteration-matrix/login.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  loginHelpers: {
    openModule,
    selectors: loginSelectors
  }
};
