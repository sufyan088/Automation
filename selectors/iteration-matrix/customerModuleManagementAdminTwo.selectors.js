const { customerModuleManagementAdminModuleNewSelectors } = require('./customerModuleManagementAdminModuleNew.selectors.js');

const customerModuleManagementAdminTwoSelectors = {
  ...customerModuleManagementAdminModuleNewSelectors,
  modulePage: {
    ...customerModuleManagementAdminModuleNewSelectors.modulePage,
    userManagementLink: [
      { type: 'role', role: 'link', options: { name: 'User Management', exact: true }, name: 'user-management-link' },
      { type: 'css', value: 'a[href*="/app/admin/user-management"]', name: 'user-management-route' }
    ]
  }
};

module.exports = {
  customerModuleManagementAdminTwoSelectors
};
