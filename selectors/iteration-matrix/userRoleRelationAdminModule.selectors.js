const userRoleRelationAdminModuleSelectors = {
  adminModule: [
    'a:has-text("Admin")',
    'main a[href*="/admin"]'
  ],
  userRoleRelationLink: [
    'a:has-text("User Role Relation")',
    'a[href="/app/admin/user-management"]',
    'a:has-text("User Management")'
  ],
  pageHeading: [
    'h1:has-text("User Role Relation")',
    'h1:has-text("User Management")',
    'h2:has-text("User Management")',
    'text="Manage all realm users here."'
  ],
  selectUserButton: [
    'button:has-text("Select User")'
  ],
  userOptions: [
    '[role="option"]'
  ],
  selectedUserValue: [
    'button:has-text("Select User")',
    '[role="option"]'
  ],
  returnToTopButton: [
    'button:has-text("Return to top")'
  ],
  assignSelectedRolesButton: [
    'button:has-text("Assign selected roles")'
  ],
  unassignSelectedRolesButton: [
    'button:has-text("Unassign selected roles")'
  ],
  roleCheckboxButtons: [
    'button[role="checkbox"]'
  ]
};

module.exports = {
  userRoleRelationAdminModuleSelectors
};
