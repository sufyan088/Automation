const customerModuleManagementAdminModuleSelectors = {
  adminModule: [
    { type: 'role', role: 'link', options: { name: 'Admin', exact: true }, name: 'admin-link' },
    { type: 'css', value: 'a[href="/app/admin"]', name: 'admin-route-link' },
    { type: 'text', value: 'Admin', options: { exact: true }, name: 'admin-text' }
  ],
  customerModuleManagementLink: [
    { type: 'role', role: 'link', options: { name: 'Customer Module Management', exact: true }, name: 'customer-module-management-link' },
    { type: 'css', value: 'a[href*="/app/admin/customer-module-management"]', name: 'customer-module-management-route' }
  ],
  customerManagementLink: [
    { type: 'role', role: 'link', options: { name: 'Customer Management', exact: true }, name: 'customer-management-link' },
    { type: 'css', value: 'a[href*="/app/admin/customer-management"]', name: 'customer-management-route' }
  ],
  headings: {
    customerModuleManagement: [
      { type: 'role', role: 'heading', options: { name: 'Customer Module Management', exact: true }, name: 'customer-module-management-heading' },
      { type: 'text', value: 'Customer Module Management', options: { exact: true }, name: 'customer-module-management-text' }
    ],
    customerManagement: [
      { type: 'role', role: 'heading', options: { name: 'Customer Management', exact: true }, name: 'customer-management-heading' }
    ],
    updateSubscription: [
      { type: 'role', role: 'heading', options: { name: 'Update Customer Module Subscription', exact: true }, name: 'update-subscription-heading' },
      { type: 'text', value: 'Update Customer Module Subscription', options: { exact: true }, name: 'update-subscription-text' }
    ]
  },
  routeFragments: {
    customerModuleManagement: '/app/admin/customer-module-management',
    customerManagement: '/app/admin/customer-management'
  },
  table: [
    { type: 'css', value: 'table', name: 'module-table' }
  ],
  paginationButtons: {
    firstPage: [
      { type: 'role', role: 'button', options: { name: 'Go to first page', exact: true }, name: 'first-page-button' }
    ],
    previousPage: [
      { type: 'role', role: 'button', options: { name: 'Go to previous page', exact: true }, name: 'previous-page-button' }
    ],
    nextPage: [
      { type: 'role', role: 'button', options: { name: 'Go to next page', exact: true }, name: 'next-page-button' }
    ],
    lastPage: [
      { type: 'role', role: 'button', options: { name: 'Go to last page', exact: true }, name: 'last-page-button' }
    ]
  },
  searchFields: {
    allEntries: [
      { type: 'placeholder', value: 'Search all entries...', name: 'search-all-entries' },
      { type: 'placeholder', value: 'Search all customers...', name: 'search-all-customers' }
    ],
    buyerName: [
      { type: 'placeholder', value: 'Search customer name...', name: 'search-customer-name' },
      { type: 'placeholder', value: 'Search buyer names...', name: 'search-buyer-names' }
    ]
  },
  buttons: {
    status: [
      { type: 'role', role: 'button', options: { name: 'Status', exact: true }, name: 'status-button' },
      { type: 'text', value: 'Status', options: { exact: true }, name: 'status-text' },
      {
        type: 'custom',
        name: 'status-combobox-fallback',
        factory: (page) => page.locator('section').filter({
          has: page.locator('input[placeholder="Search all entries..."], input[placeholder="Search all customers..."]')
        }).locator('[role="combobox"]').last()
      }
    ],
    reset: [
      { type: 'role', role: 'button', options: { name: /reset search filters|search reset/i }, name: 'search-reset-button' },
      { type: 'text', value: 'Search Reset', options: { exact: true }, name: 'search-reset-text' }
    ],
    columnOrder: [
      { type: 'role', role: 'button', options: { name: 'Column Order', exact: true }, name: 'column-order-button' },
      { type: 'css', value: 'button[aria-label="Column settings"]', name: 'column-settings-button' }
    ],
    returnToTop: [
      { type: 'role', role: 'button', options: { name: /return to top/i }, name: 'return-to-top-button' },
      { type: 'text', value: 'Return to top', options: { exact: true }, name: 'return-to-top-text' }
    ],
    updateSubscription: [
      { type: 'role', role: 'button', options: { name: /update subscription/i }, name: 'update-subscription-button' },
      { type: 'text', value: 'Update Subscription', options: { exact: true }, name: 'update-subscription-text' }
    ],
    clearAll: [
      { type: 'role', role: 'button', options: { name: /clear all/i }, name: 'clear-all-button' },
      { type: 'text', value: 'Clear All', options: { exact: true }, name: 'clear-all-text' }
    ],
    close: [
      { type: 'role', role: 'button', options: { name: /^close$/i }, name: 'close-button' },
      { type: 'css', value: 'button[aria-label="Close"]', name: 'close-aria-button' }
    ],
    update: [
      { type: 'role', role: 'button', options: { name: /update subscriptions?|update/i }, name: 'update-button' },
      { type: 'text', value: 'Update Subscriptions', options: { exact: true }, name: 'update-subscriptions-text' },
      { type: 'text', value: 'Update', options: { exact: true }, name: 'update-text' }
    ]
  },
  overlays: {
    columnOrderSearch: [
      { type: 'placeholder', value: 'Search columns...', name: 'search-columns-input' },
      { type: 'text', value: 'Column Order', options: { exact: true }, name: 'column-order-title' }
    ],
    statusPopup: [
      { type: 'css', value: '[role="menu"]', name: 'status-menu' },
      { type: 'css', value: '[role="dialog"]', name: 'status-dialog' },
      { type: 'css', value: '[role="listbox"]', name: 'status-listbox' }
    ],
    dialog: [
      { type: 'role', role: 'dialog', options: {}, name: 'modal-dialog' }
    ]
  },
  columns: {
    customerName: 'Customer Name',
    orgId: 'Org Id'
  },
  rowActionButtons: {
    imREmitOnboardPending: [
      {
        type: 'custom',
        name: 'imremit-onboard-pending-button',
        factory: (page) => page.locator('button').filter({ hasText: /imREmit Onboard Pending/i }).first()
      },
      {
        type: 'custom',
        name: 'chevron-right-button',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-chevron-right, svg[class*="lucide-chevron-right"]') }).first()
      }
    ],
    imREmitLiteOnboardPending: [
      {
        type: 'custom',
        name: 'imremit-lite-onboard-pending-button',
        factory: (page) => page.locator('button').filter({ hasText: /imREmit Lite Onboard Pending/i }).first()
      },
      { type: 'text', value: 'imREmit Lite Onboard Pending', options: { exact: true }, name: 'imremit-lite-onboard-pending-text' }
    ],
    duplicatePaymentsOnboardPending: [
      {
        type: 'custom',
        name: 'duplicate-payments-onboard-pending-button',
        factory: (page) => page.locator('button').filter({ hasText: /Duplicate Payments Onboard Pending/i }).first()
      },
      { type: 'text', value: 'Duplicate Payments Onboard Pending', options: { exact: true }, name: 'duplicate-payments-onboard-pending-text' }
    ],
    unOnboardModule: [
      {
        type: 'custom',
        name: 'package-minus-button',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-package-minus, svg.lucide-package-x, svg[class*="lucide-package-minus"], svg[class*="lucide-package-x"]') })
      }
    ]
  },
  modal: {
    moduleSelectorTrigger: [
      {
        type: 'custom',
        name: 'modal-module-trigger',
        factory: (page) => page.getByRole('dialog').locator('form > button').first()
      }
    ],
    option: (name) => [
      { type: 'role', role: 'option', options: { name, exact: true }, name: `option-${name}` },
      { type: 'text', value: name, options: { exact: true }, name: `text-${name}` }
    ],
    selectedBadge: (name) => [
      { type: 'text', value: name, options: { exact: true }, name: `badge-${name}` }
    ]
  },
  toasts: {
    subscriptionUpdated: [
      { type: 'text', value: 'Subscription updated successfully', options: { exact: true }, name: 'subscription-updated-toast' }
    ]
  }
};

module.exports = {
  customerModuleManagementAdminModuleSelectors
};
