const customerManagementAdminSelectors = {
  adminModule: [
    'a:has-text("Admin")',
    'a[href="/app/admin"]',
    'text="Admin"'
  ],
  adminHeading: [
    'h1:has-text("Admin")',
    'text="Admin"'
  ],
  adminSubrouteNavigation: [
    'h2:has-text("Admin Subroute Navigation")',
    'nav:has-text("Customer Management")'
  ],
  adminSubrouteLinks: {
    customerManagement: [
      'a:has-text("Customer Management")',
      'a[href*="/app/admin/customer-management"]'
    ],
    userManagement: [
      'a:has-text("User Management")',
      'a[href*="/app/admin/user-management"]'
    ],
    customerModuleManagement: [
      'a:has-text("Customer Module Management")',
      'a[href*="/app/admin/customer-module-management"]'
    ],
    masterRoleSettings: [
      'a:has-text("Master Role Settings")',
      'a[href*="/app/admin/master-role-settings"]'
    ],
    alertManagement: [
      'a:has-text("Alert Management")',
      'a[href*="/app/admin/alert-management"]'
    ],
    adminReports: [
      'a:has-text("Admin Reports")',
      'a[href*="/app/admin/admin-reports"]'
    ],
    supplierOnboarding: [
      'a:has-text("Supplier Onboarding")',
      'a[href*="/app/admin/supplier-onboarding"]'
    ],
    supplierManagement: [
      'a:has-text("Supplier Management")',
      'a[href*="/app/admin/supplier-management"]'
    ]
  },
  pageHeadings: {
    customerManagement: [
      'h1:has-text("Customer Management")',
      'h2:has-text("Customer Management")'
    ],
    userManagement: [
      'h1:has-text("User Management")',
      'h2:has-text("User Management")'
    ],
    adminReports: [
      'h1:has-text("Admin Reports")',
      'h2:has-text("Admin Reports")'
    ],
    supplierOnboarding: [
      'h1:has-text("Supplier Onboarding")',
      'h2:has-text("Supplier Onboarding")'
    ],
    supplierManagement: [
      'h1:has-text("Supplier Management")',
      'h2:has-text("Supplier Management")'
    ]
  },
  paginationSummary: [
    'p:has-text("Page:")'
  ],
  paginationButtons: {
    firstPage: 'Go to first page',
    previousPage: 'Go to previous page',
    nextPage: 'Go to next page',
    lastPage: 'Go to last page'
  },
  routeFragments: {
    customerManagement: '/app/admin/customer-management',
    userManagement: '/app/admin/user-management',
    customerModuleManagement: '/app/admin/customer-module-management',
    masterRoleSettings: '/app/admin/master-role-settings',
    alertManagement: '/app/admin/alert-management'
  },
  searchFields: {
    allCustomers: [
      'input[placeholder="Search all customers..."]',
      'input[placeholder="Search all entries..."]'
    ],
    customerName: [
      'input[placeholder="Filter by customer name..."]'
    ],
    usernames: [
      'input[placeholder="Search usernames..."]'
    ]
  },
  filterButtons: {
    status: [
      'button:has-text("Status")'
    ]
  },
  columnOrderButton: [
    'button:has-text("Column Order")',
    'button[aria-label="Column settings"]'
  ]
};

module.exports = {
  customerManagementAdminSelectors
};
