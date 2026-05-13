const invoiceTrackerSelectors = {
  factories: {
    invoiceDateHeader: (page) => page.locator('table thead').getByText('Invoice Date', { exact: true }).first()
  },
  navigation: {
    moduleLauncher: [
      {
        type: 'custom',
        name: 'invoice-launcher-tile',
        factory: (page) => page.locator('div[class*="w-full"][class*="h-full"][class*="justify-center"][class*="items-center"]').first()
      }
    ],
    trackerLink: [
      { type: 'role', role: 'link', options: { name: /Invoice[s]? Tracker/i }, name: 'invoice-tracker-link' },
      { type: 'css', value: 'a[href*="/app/invoices/tracker"]', name: 'invoice-tracker-route' },
      { type: 'text', value: 'Invoice Tracker', options: { exact: true }, name: 'invoice-tracker-text' },
      { type: 'text', value: 'Invoices Tracker', options: { exact: true }, name: 'invoices-tracker-text' }
    ],
    heading: [
      { type: 'role', role: 'heading', options: { name: 'Invoices', exact: true }, name: 'invoices-heading' },
      { type: 'text', value: 'Invoices', options: { exact: true }, name: 'invoices-text' }
    ]
  },
  filters: {
    customerButton: [
      { type: 'role', role: 'combobox', options: { name: /Select customers|min 3 characters/i }, name: 'customer-filter-combobox' },
      { type: 'role', role: 'button', options: { name: /select customers|min 3 characters/i }, name: 'customer-filter-button' },
      { type: 'text', value: 'Select customers (min 3 characters)', options: { exact: false }, name: 'customer-filter-text' }
    ],
    supplierButton: [
      {
        type: 'custom',
        name: 'supplier-filter-last-combobox',
        factory: (page) => page.locator('main article').locator('[role="combobox"]').last()
      },
      { type: 'role', role: 'combobox', options: { name: /Select customer first|Search suppliers|min 3 characters/i }, name: 'supplier-filter-combobox' },
      { type: 'role', role: 'button', options: { name: /search suppliers|select supplier|suppliers/i }, name: 'supplier-filter-button' },
      { type: 'text', value: 'Search suppliers (min 3 characters)', options: { exact: false }, name: 'supplier-filter-text' },
      { type: 'text', value: 'Select customer first', options: { exact: false }, name: 'supplier-select-customer-first-text' }
    ],
    startDateButton: [
      { type: 'role', role: 'button', options: { name: /Start Date/i }, name: 'start-date-button' },
      { type: 'text', value: 'Start Date', options: { exact: true }, name: 'start-date-text' }
    ],
    endDateButton: [
      { type: 'role', role: 'button', options: { name: /End Date/i }, name: 'end-date-button' },
      { type: 'text', value: 'End Date', options: { exact: true }, name: 'end-date-text' }
    ],
    advancedSearchButton: [
      { type: 'role', role: 'button', options: { name: /Advanced Search/i }, name: 'advanced-search-button' },
      { type: 'text', value: 'Advanced Search', options: { exact: true }, name: 'advanced-search-text' }
    ],
    statusButton: [
      { type: 'role', role: 'button', options: { name: /^Status$/i }, name: 'status-button' },
      { type: 'text', value: 'Status', options: { exact: true }, name: 'status-text' }
    ],
    columnOrderButton: [
      { type: 'role', role: 'button', options: { name: /Column Order|Column Views/i }, name: 'column-order-button' },
      { type: 'text', value: 'Column Order', options: { exact: true }, name: 'column-order-text' },
      { type: 'text', value: 'Column Views', options: { exact: true }, name: 'column-views-text' }
    ],
    saveSearchButton: [
      { type: 'role', role: 'button', options: { name: /Save Search/i }, name: 'save-search-button' },
      { type: 'text', value: 'Save Search', options: { exact: true }, name: 'save-search-text' }
    ],
    returnToTopButton: [
      { type: 'role', role: 'button', options: { name: /Return to top/i }, name: 'return-to-top-button' },
      { type: 'text', value: 'Return to top', options: { exact: true }, name: 'return-to-top-text' }
    ]
  },
  search: {
    customerInput: [
      { type: 'placeholder', value: 'Search customers (min 3 characters)...', name: 'customer-search-placeholder' },
      { type: 'placeholder', value: 'Search customers...', name: 'customer-search-short-placeholder' }
    ]
  },
  pagination: {
    previousButton: [
      { type: 'role', role: 'button', options: { name: /Go to previous page/i }, name: 'previous-page-button' },
      {
        type: 'custom',
        name: 'previous-page-icon-button',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-left') }).first()
      }
    ],
    nextButton: [
      { type: 'role', role: 'button', options: { name: /Go to next page/i }, name: 'next-page-button' },
      {
        type: 'custom',
        name: 'next-page-icon-button',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-right') }).first()
      }
    ],
    lastButton: [
      { type: 'role', role: 'button', options: { name: /Go to last page/i }, name: 'last-page-button' },
      {
        type: 'custom',
        name: 'last-page-icon-button',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-right-to-line') }).first()
      }
    ],
    firstButton: [
      { type: 'role', role: 'button', options: { name: /Go to first page/i }, name: 'first-page-button' },
      {
        type: 'custom',
        name: 'first-page-icon-button',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-left-to-line, svg.lucide-arrow-right-from-line') }).first()
      }
    ],
    trigger: [
      {
        type: 'custom',
        name: 'pagination-size-combobox',
        factory: (page) => page.locator('main article').locator('[role="combobox"]').filter({ hasText: /^(5|10|25|50|100)$/ }).first()
      },
      {
        type: 'custom',
        name: 'pagination-size-trigger',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-chevron-down') }).first()
      }
    ],
    menuSignals: [
      { type: 'text', value: '5', options: { exact: true }, name: 'pagination-option-5' },
      { type: 'text', value: '100', options: { exact: true }, name: 'pagination-option-100' }
    ]
  },
  status: {
    menuSignals: [
      { type: 'text', value: '(Select All)', options: { exact: true }, name: 'status-select-all' },
      { type: 'text', value: 'Pending Approval', options: { exact: true }, name: 'status-pending-approval' }
    ],
    selectAll: [
      { type: 'text', value: '(Select All)', options: { exact: true }, name: 'status-select-all-text' }
    ],
    pendingApproval: [
      { type: 'text', value: 'Pending Approval', options: { exact: true }, name: 'status-pending-approval-text' }
    ],
    approved: [
      { type: 'text', value: 'Approved', options: { exact: true }, name: 'status-approved-text' }
    ],
    deleted: [
      { type: 'text', value: 'Deleted', options: { exact: true }, name: 'status-deleted-text' }
    ],
    paid: [
      { type: 'text', value: 'Paid', options: { exact: true }, name: 'status-paid-text' }
    ]
  },
  columnSettings: {
    menuSignals: [
      { type: 'text', value: 'Org Id', options: { exact: true }, name: 'column-org-id' },
      { type: 'text', value: 'ERP Unique ID', options: { exact: true }, name: 'column-erp-unique-id' }
    ],
    orgId: [
      { type: 'text', value: 'Org Id', options: { exact: true }, name: 'column-org-id-text' }
    ],
    invoiceNumber: [
      { type: 'text', value: 'Invoice Number', options: { exact: true }, name: 'column-invoice-number-text' }
    ],
    invoiceDate: [
      { type: 'text', value: 'Invoice Date', options: { exact: true }, name: 'column-invoice-date-text' }
    ],
    erpUniqueId: [
      { type: 'text', value: 'ERP Unique ID', options: { exact: true }, name: 'column-erp-unique-id-text' }
    ]
  },
  table: {
    invoiceDateHeader: [
      {
        type: 'custom',
        name: 'invoice-date-table-header',
        factory: (page) => page.locator('table thead').getByText('Invoice Date', { exact: true }).first()
      }
    ],
    sortMenuSignals: [
      { type: 'text', value: 'Ascending', options: { exact: true }, name: 'sort-ascending-option' },
      { type: 'text', value: 'Hide column', options: { exact: true }, name: 'sort-hide-column-option' }
    ],
    ascendingOption: [
      { type: 'text', value: 'Ascending', options: { exact: true }, name: 'ascending-text' },
      { type: 'text', value: 'Asc', options: { exact: true }, name: 'ascending-short-text' }
    ],
    descendingOption: [
      { type: 'text', value: 'Descending', options: { exact: true }, name: 'descending-text' },
      { type: 'text', value: 'Desc', options: { exact: true }, name: 'descending-short-text' },
      { type: 'text', value: 'Dsc', options: { exact: true }, name: 'descending-aiq-short-text' }
    ],
    hideColumnOption: [
      { type: 'text', value: 'Hide column', options: { exact: true }, name: 'hide-column-text' },
      { type: 'text', value: 'Hide', options: { exact: true }, name: 'hide-column-short-text' }
    ]
  },
  advancedSearch: {
    panelSignals: [
      { type: 'text', value: 'Facilities', options: { exact: true }, name: 'advanced-search-facilities' },
      { type: 'text', value: 'Invoice Amount', options: { exact: true }, name: 'advanced-search-invoice-amount' }
    ]
  },
  savedSearch: {
    toolbarChooser: [
      { type: 'role', role: 'combobox', options: { name: /Choose saved search/i }, name: 'saved-search-toolbar-combobox' },
      { type: 'text', value: 'Choose saved search', options: { exact: false }, name: 'saved-search-toolbar-text' }
    ],
    dialogTriggers: [
      { type: 'text', value: 'Saved Searches', options: { exact: true }, name: 'saved-searches-trigger' }
    ],
    dialogSignals: [
      { type: 'role', role: 'combobox', options: { name: /Choose saved search/i }, name: 'saved-search-toolbar-combobox-signal' },
      { type: 'text', value: 'Reset search', options: { exact: true }, name: 'reset-search-text' },
      { type: 'text', value: 'Delete All', options: { exact: true }, name: 'delete-all-text' },
      { type: 'text', value: 'Save search criteria', options: { exact: false }, name: 'save-search-criteria-text' }
    ],
    resetButton: [
      { type: 'role', role: 'button', options: { name: /Reset search/i }, name: 'reset-search-button' },
      { type: 'text', value: 'Reset search', options: { exact: true }, name: 'reset-search-text-button' }
    ],
    deleteAllButton: [
      { type: 'role', role: 'button', options: { name: /Delete All/i }, name: 'delete-all-button' },
      { type: 'text', value: 'Delete All', options: { exact: true }, name: 'delete-all-text-button' }
    ]
  }
};

module.exports = {
  invoiceTrackerSelectors
};
