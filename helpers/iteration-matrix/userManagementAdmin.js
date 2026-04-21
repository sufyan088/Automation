const { userManagementAdminSelectors } = require('../../selectors/iteration-matrix/userManagementAdmin.selectors.js');

async function openModule(page) {
  return page;
}

module.exports = {
  userManagementAdminHelpers: {
    openModule,
    selectors: userManagementAdminSelectors
  }
};
