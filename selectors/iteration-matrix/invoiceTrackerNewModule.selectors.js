const invoiceTrackerNewModuleSelectors = {
  navigation: {
    supportTicketsLink: [
      { type: 'role', role: 'link', options: { name: /Support Tickets/i }, name: 'support-tickets-link' },
      { type: 'css', value: 'a[href*="/app/invoices/ticketing"]', name: 'support-tickets-route' },
      { type: 'text', value: 'Support Tickets', options: { exact: true }, name: 'support-tickets-text' }
    ],
    pageHeading: [
      { type: 'role', role: 'heading', options: { name: /Invoice Support Tickets/i }, name: 'invoice-support-tickets-heading' },
      { type: 'text', value: 'Invoice Support Tickets', options: { exact: true }, name: 'invoice-support-tickets-text' }
    ],
    dashboardHeading: [
      { type: 'role', role: 'heading', options: { name: /Support Tickets Dashboard/i }, name: 'support-tickets-dashboard-heading' },
      { type: 'text', value: 'Support Tickets Dashboard', options: { exact: true }, name: 'support-tickets-dashboard-text' }
    ]
  },
  tabs: {
    dashboard: [
      { type: 'role', role: 'tab', options: { name: /Dashboard/i }, name: 'dashboard-tab' },
      { type: 'role', role: 'button', options: { name: /^Dashboard$/i }, name: 'dashboard-button' },
      { type: 'text', value: 'Dashboard', options: { exact: true }, name: 'dashboard-text' }
    ],
    issueCodeManagement: [
      { type: 'role', role: 'tab', options: { name: /Issue Code Management/i }, name: 'issue-code-management-tab' },
      { type: 'role', role: 'button', options: { name: /Issue Code Management/i }, name: 'issue-code-management-button' },
      { type: 'text', value: 'Issue Code Management', options: { exact: true }, name: 'issue-code-management-text' }
    ],
    createSupportTicket: [
      { type: 'role', role: 'tab', options: { name: /Create Support Ticket/i }, name: 'create-support-ticket-tab' },
      { type: 'role', role: 'button', options: { name: /Create Support Ticket/i }, name: 'create-support-ticket-button' },
      { type: 'text', value: 'Create Support Ticket', options: { exact: true }, name: 'create-support-ticket-text' }
    ]
  },
  dashboard: {
    searchAllEntriesInput: [
      { type: 'placeholder', value: 'Search all entries...', name: 'dashboard-search-all-entries-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /search all entries/i }, name: 'dashboard-search-all-entries-textbox' }
    ],
    ticketInput: [
      { type: 'role', role: 'textbox', options: { name: /ticket/i }, name: 'dashboard-ticket-textbox' },
      { type: 'placeholder', value: 'Ticket', name: 'dashboard-ticket-placeholder' }
    ],
    invoiceInput: [
      { type: 'role', role: 'textbox', options: { name: /invoice/i }, name: 'dashboard-invoice-textbox' },
      { type: 'placeholder', value: 'Invoice', name: 'dashboard-invoice-placeholder' }
    ],
    statusesButton: [
      { type: 'role', role: 'button', options: { name: /Invoice Statuses|Statuses/i }, name: 'dashboard-statuses-button' },
      { type: 'text', value: 'Invoice Statuses', options: { exact: true }, name: 'dashboard-invoice-statuses-text' },
      { type: 'text', value: 'Statuses', options: { exact: true }, name: 'dashboard-statuses-text' }
    ],
    advancedFiltersButton: [
      { type: 'role', role: 'button', options: { name: /Advanced Filters|Filters/i }, name: 'dashboard-advanced-filters-button' },
      { type: 'text', value: 'Advanced Filters', options: { exact: true }, name: 'dashboard-advanced-filters-text' }
      ,{ type: 'text', value: 'Filters', options: { exact: true }, name: 'dashboard-filters-text' }
    ],
    resetButton: [
      { type: 'role', role: 'button', options: { name: /Reset/i }, name: 'dashboard-reset-button' },
      { type: 'text', value: 'Reset', options: { exact: true }, name: 'dashboard-reset-text' }
    ],
    columnViewsButton: [
      { type: 'role', role: 'button', options: { name: /Column Views/i }, name: 'dashboard-column-views-button' },
      { type: 'text', value: 'Column Views', options: { exact: true }, name: 'dashboard-column-views-text' }
    ],
    actionButton: [
      { type: 'role', role: 'button', options: { name: /Action/i }, name: 'dashboard-action-button' },
      { type: 'text', value: 'Action', options: { exact: true }, name: 'dashboard-action-text' }
    ],
    editButton: [
      { type: 'role', role: 'menuitem', options: { name: /Edit/i }, name: 'dashboard-edit-menuitem' },
      { type: 'role', role: 'button', options: { name: /Edit/i }, name: 'dashboard-edit-button' },
      { type: 'text', value: 'Edit', options: { exact: true }, name: 'dashboard-edit-text' }
    ],
    deleteButton: [
      { type: 'role', role: 'menuitem', options: { name: /Delete/i }, name: 'dashboard-delete-menuitem' },
      { type: 'role', role: 'button', options: { name: /Delete/i }, name: 'dashboard-delete-button' },
      { type: 'text', value: 'Delete', options: { exact: true }, name: 'dashboard-delete-text' }
    ],
    selectAll: [
      { type: 'text', value: '(Select All)', options: { exact: true }, name: 'statuses-select-all' }
    ],
    clear: [
      { type: 'role', role: 'button', options: { name: /Clear/i }, name: 'statuses-clear-button' },
      { type: 'text', value: 'Clear', options: { exact: true }, name: 'statuses-clear-text' }
    ],
    tableHeaders: {
      customer: [
        { type: 'text', value: 'Customer', options: { exact: true }, name: 'dashboard-customer-header' }
      ],
      ticketNumber: [
        { type: 'text', value: 'Ticket Number', options: { exact: true }, name: 'dashboard-ticket-number-header' }
      ],
      invoice: [
        { type: 'text', value: 'Invoice', options: { exact: true }, name: 'dashboard-invoice-header' }
      ],
      statuses: [
        { type: 'text', value: 'Statuses', options: { exact: true }, name: 'dashboard-statuses-header' }
      ]
    },
    sortMenu: {
      signals: [
        { type: 'text', value: 'Ascending', options: { exact: true }, name: 'sort-ascending-text' },
        { type: 'text', value: 'Hide column', options: { exact: true }, name: 'sort-hide-column-text' }
      ],
      asc: [
        { type: 'text', value: 'Ascending', options: { exact: true }, name: 'sort-ascending-option' },
        { type: 'text', value: 'Asc', options: { exact: true }, name: 'sort-asc-option' }
      ],
      desc: [
        { type: 'text', value: 'Descending', options: { exact: true }, name: 'sort-descending-option' },
        { type: 'text', value: 'Desc', options: { exact: true }, name: 'sort-desc-option' }
      ],
      hide: [
        { type: 'text', value: 'Hide column', options: { exact: true }, name: 'sort-hide-column-option' },
        { type: 'text', value: 'Hide', options: { exact: true }, name: 'sort-hide-option' }
      ]
    }
  },
  advancedFilters: {
    panelSignals: [
      { type: 'text', value: 'Contact Emails', options: { exact: true }, name: 'advanced-filters-contact-emails' },
      { type: 'text', value: 'Supplier Number', options: { exact: true }, name: 'advanced-filters-supplier-number' }
    ],
    contactEmailsInput: [
      { type: 'role', role: 'textbox', options: { name: /contact emails?/i }, name: 'advanced-filters-contact-emails-textbox' },
      { type: 'placeholder', value: 'Contact Emails', name: 'advanced-filters-contact-emails-placeholder' },
      { type: 'placeholder', value: 'Search by contact emails...', name: 'advanced-filters-contact-emails-search-placeholder' }
    ],
    contactPhoneInput: [
      { type: 'role', role: 'textbox', options: { name: /contact phone/i }, name: 'advanced-filters-contact-phone-textbox' },
      { type: 'placeholder', value: 'Contact Phone', name: 'advanced-filters-contact-phone-placeholder' },
      { type: 'placeholder', value: 'Search by contact phone...', name: 'advanced-filters-contact-phone-search-placeholder' }
    ],
    supplierNumberInput: [
      { type: 'role', role: 'textbox', options: { name: /supplier number/i }, name: 'advanced-filters-supplier-number-textbox' },
      { type: 'placeholder', value: 'Supplier Number', name: 'advanced-filters-supplier-number-placeholder' },
      { type: 'placeholder', value: 'Search by supplier number...', name: 'advanced-filters-supplier-number-search-placeholder' }
    ],
    issueCodeInput: [
      { type: 'role', role: 'textbox', options: { name: /issue code/i }, name: 'advanced-filters-issue-code-textbox' },
      { type: 'placeholder', value: 'Issue Code', name: 'advanced-filters-issue-code-placeholder' },
      { type: 'placeholder', value: 'Search by issue code...', name: 'advanced-filters-issue-code-search-placeholder' }
    ],
    contactNameInput: [
      { type: 'role', role: 'textbox', options: { name: /contact name/i }, name: 'advanced-filters-contact-name-textbox' },
      { type: 'placeholder', value: 'Contact Name', name: 'advanced-filters-contact-name-placeholder' },
      { type: 'placeholder', value: 'Search by contact name...', name: 'advanced-filters-contact-name-search-placeholder' }
    ]
  },
  createTicket: {
    heading: [
      { type: 'role', role: 'heading', options: { name: /Create Support Ticket/i }, name: 'create-support-ticket-heading' },
      { type: 'text', value: 'Create Support Ticket', options: { exact: true }, name: 'create-support-ticket-heading-text' }
    ],
    customerTrigger: [
      { type: 'role', role: 'combobox', options: { name: /Search customers|min 3 characters/i }, name: 'create-ticket-customer-combobox' },
      { type: 'role', role: 'button', options: { name: /Search customers|min 3 characters/i }, name: 'create-ticket-customer-button' },
      { type: 'text', value: 'Search customers (min 3 characters)', options: { exact: false }, name: 'create-ticket-customer-text' }
    ],
    issueCodeTrigger: [
      { type: 'role', role: 'combobox', options: { name: /issue code/i }, name: 'create-ticket-issue-code-combobox' },
      { type: 'role', role: 'button', options: { name: /issue code/i }, name: 'create-ticket-issue-code-button' },
      { type: 'text', value: 'Select an issue code...', options: { exact: false }, name: 'create-ticket-issue-code-text' }
    ],
    issueCodeLabel: [
      { type: 'text', value: 'Issue Code', options: { exact: false }, name: 'create-ticket-issue-code-label' }
    ],
    invoiceSelectionHeading: [
      { type: 'role', role: 'heading', options: { name: /Invoice Selection/i }, name: 'create-ticket-invoice-selection-heading' },
      { type: 'text', value: 'Invoice Selection', options: { exact: true }, name: 'create-ticket-invoice-selection-text' }
    ],
    ticketNumberInput: [
      { type: 'role', role: 'textbox', options: { name: /ticket number/i }, name: 'create-ticket-ticket-number-input' },
      { type: 'placeholder', value: 'Ticket Number', name: 'create-ticket-ticket-number-placeholder' }
    ],
    statusesButton: [
      { type: 'role', role: 'button', options: { name: /Statuses/i }, name: 'create-ticket-statuses-button' },
      { type: 'text', value: 'Statuses', options: { exact: true }, name: 'create-ticket-statuses-text' }
    ],
    contactEmailInput: [
      { type: 'role', role: 'textbox', options: { name: /contact email/i }, name: 'create-ticket-contact-email-input' },
      { type: 'placeholder', value: 'Contact Email', name: 'create-ticket-contact-email-placeholder' }
    ],
    contactPhoneInput: [
      { type: 'role', role: 'textbox', options: { name: /contact phone/i }, name: 'create-ticket-contact-phone-input' },
      { type: 'placeholder', value: 'Contact Phone', name: 'create-ticket-contact-phone-placeholder' }
    ],
    contactNameInput: [
      { type: 'role', role: 'textbox', options: { name: /contact name/i }, name: 'create-ticket-contact-name-input' },
      { type: 'placeholder', value: 'Contact Name', name: 'create-ticket-contact-name-placeholder' }
    ],
    descriptionInput: [
      { type: 'role', role: 'textbox', options: { name: /description/i }, name: 'create-ticket-description-input' },
      { type: 'label', value: /description/i, name: 'create-ticket-description-label' }
    ],
    createButton: [
      { type: 'role', role: 'button', options: { name: /^Create Support Ticket$/i }, name: 'create-ticket-submit-button' },
      { type: 'text', value: 'Create Support Ticket', options: { exact: true }, name: 'create-ticket-submit-text' }
    ],
    updateButton: [
      { type: 'role', role: 'button', options: { name: /Update Support Ticket/i }, name: 'update-support-ticket-button' },
      { type: 'text', value: 'Update Support Ticket', options: { exact: true }, name: 'update-support-ticket-text' }
    ],
    cancelButton: [
      { type: 'role', role: 'button', options: { name: /^Cancel$/i }, name: 'support-ticket-cancel-button' },
      { type: 'text', value: 'Cancel', options: { exact: true }, name: 'support-ticket-cancel-text' }
    ],
    deleteButton: [
      { type: 'role', role: 'button', options: { name: /^Delete$/i }, name: 'support-ticket-delete-button' },
      { type: 'text', value: 'Delete', options: { exact: true }, name: 'support-ticket-delete-text' }
    ],
    closeButton: [
      { type: 'role', role: 'button', options: { name: /close/i }, name: 'support-ticket-close-button' },
      { type: 'css', value: 'button[aria-label*="Close"]', name: 'support-ticket-close-aria' }
    ],
    viewInvoicesTrackerButton: [
      { type: 'role', role: 'button', options: { name: /View Invoices Tracker/i }, name: 'view-invoices-tracker-button' },
      { type: 'text', value: 'View Invoices Tracker', options: { exact: true }, name: 'view-invoices-tracker-text' }
    ]
  }
};

module.exports = {
  invoiceTrackerNewModuleSelectors
};
