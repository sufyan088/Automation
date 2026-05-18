const supplierManagementImremitNewSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /^imremit( premium)?$/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /^imremit( premium)?$/i }, name: 'imremit-button' },
      { type: 'text', value: /^imremit$/i, name: 'imremit-text' }
    ],
    supplierManagement: [
      { type: 'role', role: 'link', options: { name: /^supplier management$/i }, name: 'supplier-management-link' },
      { type: 'role', role: 'button', options: { name: /^supplier management$/i }, name: 'supplier-management-button' },
      { type: 'text', value: /^supplier management$/i, name: 'supplier-management-text' }
    ]
  },
  headings: {
    module: [
      { type: 'role', role: 'heading', options: { name: /^imremit$/i }, name: 'imremit-heading' },
      { type: 'text', value: /^imremit$/i, name: 'imremit-heading-text' }
    ],
    supplierManagement: [
      { type: 'role', role: 'heading', options: { name: /^supplier management$/i }, name: 'supplier-management-heading' },
      { type: 'text', value: /^supplier management$/i, name: 'supplier-management-heading-text' }
    ],
    supplierDetails: [
      { type: 'role', role: 'heading', options: { name: /^supplier details$/i }, name: 'supplier-details-heading' },
      { type: 'text', value: /^supplier details$/i, name: 'supplier-details-text' }
    ],
    exportSupplierDetails: [
      { type: 'role', role: 'heading', options: { name: /^export supplier details$/i }, name: 'export-supplier-details-heading' },
      { type: 'role', role: 'heading', options: { name: /^export supplier management data$/i }, name: 'export-supplier-management-data-heading' },
      { type: 'text', value: /^export supplier details$/i, name: 'export-supplier-details-text' },
      { type: 'text', value: /^export supplier management data$/i, name: 'export-supplier-management-data-text' }
    ]
  },
  customerPicker: {
    trigger: [
      { type: 'role', role: 'combobox', options: { name: /select a customer/i }, name: 'customer-picker-add-form-combobox' },
      { type: 'role', role: 'combobox', options: { name: /select all/i }, name: 'customer-picker-list-combobox' },
      { type: 'role', role: 'button', options: { name: /^select all$/i }, name: 'customer-picker-select-all' },
      { type: 'role', role: 'button', options: { name: /select a customer/i }, name: 'customer-picker-select-customer' },
      { type: 'css', value: '[role="combobox"]', name: 'customer-picker-combobox' }
    ],
    searchInput: [
      { type: 'placeholder', value: /search customers? \(min\. 3 characters\)\.\.\./i, name: 'customer-search-placeholder' },
      { type: 'css', value: 'input[placeholder*="Search customers"]', name: 'customer-search-css' }
    ]
  },
  list: {
    searchInput: [
      { type: 'placeholder', value: /search all entries\.\.\./i, name: 'search-all-entries-placeholder' },
      { type: 'css', value: 'input[placeholder="Search all entries..."]', name: 'search-all-entries-css' }
    ],
    table: [
      { type: 'css', value: 'table', name: 'supplier-table' }
    ]
  },
  actions: {
    exportDataButton: [
      { type: 'role', role: 'button', options: { name: /export data/i }, name: 'export-data-button' },
      { type: 'text', value: /export data/i, name: 'export-data-text' }
    ],
    addSupplierButton: [
      { type: 'role', role: 'button', options: { name: /add supplier/i }, name: 'add-supplier-button' },
      { type: 'role', role: 'link', options: { name: /add supplier/i }, name: 'add-supplier-link' },
      { type: 'text', value: /add supplier/i, name: 'add-supplier-text' }
    ],
    exportConfirmButton: [
      { type: 'role', role: 'button', options: { name: /^export/i }, name: 'export-confirm-button' },
      { type: 'text', value: /^exportexport$/i, name: 'export-confirm-legacy-text' }
    ],
    rowActionsButton: [
      { type: 'css', value: 'button:has(svg.lucide-grip-vertical)', name: 'row-actions-grip-button' },
      { type: 'css', value: 'button[aria-haspopup="menu"]', name: 'row-actions-menu-button' }
    ],
    editSupplierDetails: [
      { type: 'text', value: /^edit supplier details$/i, name: 'edit-supplier-details-text' },
      { type: 'css', value: '[role="menuitem"]', name: 'edit-supplier-details-menuitem' }
    ]
  },
  fields: {
    supplierName: [
      { type: 'css', value: 'input[name="supplierName"]', name: 'supplier-name-input' }
    ],
    supplierNumber: [
      { type: 'css', value: 'input[name="supplierNumber"]', name: 'supplier-number-input' }
    ],
    supplierEmail: [
      { type: 'css', value: 'input[name="supplierEmail"]', name: 'supplier-email-input' }
    ],
    phoneNumber: [
      { type: 'css', value: 'input[name="phoneNumber"]', name: 'phone-number-input' }
    ],
    declinedReason: [
      { type: 'css', value: 'textarea[name="declinedReason"]', name: 'declined-reason-textarea' }
    ]
  },
  labels: {
    supplierNameRequired: [
      { type: 'text', value: /^supplier name is required$/i, name: 'supplier-name-required-text' }
    ],
    supplierEnrollment: [
      { type: 'text', value: /supplier enrollment/i, name: 'supplier-enrollment-label' }
    ],
    declinedReason: [
      { type: 'text', value: /declined reason/i, name: 'declined-reason-label' }
    ]
  },
  radioButtons: {
    supplierEnrollmentYes: [
      { type: 'css', value: '#enrolled-yes', name: 'supplier-enrollment-yes-id' },
      { type: 'label', value: /yes/i, name: 'supplier-enrollment-yes-label' }
    ],
    supplierEnrollmentNo: [
      { type: 'css', value: '#enrolled-no', name: 'supplier-enrollment-no-id' },
      { type: 'label', value: /^no$/i, name: 'supplier-enrollment-no-label' }
    ]
  },
  buttons: {
    saveAndContinue: [
      { type: 'role', role: 'button', options: { name: /save and continue/i }, name: 'save-and-continue-button' }
    ],
    saveAndSubmit: [
      { type: 'role', role: 'button', options: { name: /save and submit/i }, name: 'save-and-submit-button' },
      { type: 'text', value: /submit form/i, name: 'save-and-submit-text' }
    ],
    approve: [
      { type: 'role', role: 'button', options: { name: /^approve$/i }, name: 'approve-button' },
      { type: 'text', value: /^approve$/i, name: 'approve-text' }
    ],
    approveConfirm: [
      { type: 'role', role: 'button', options: { name: /yes approve/i }, name: 'yes-approve-button' },
      { type: 'text', value: /yes approve/i, name: 'yes-approve-text' }
    ]
  },
  status: {
    declinedEnrollment: [
      { type: 'text', value: /declined enrollment/i, name: 'declined-enrollment-status' }
    ],
    approved: [
      { type: 'text', value: /^approved !$/i, name: 'approved-toast-title' },
      { type: 'text', value: /the form has been approved\./i, name: 'approved-toast-description' }
    ]
  },
  headingsForm: {
    editSupplier: [
      { type: 'role', role: 'heading', options: { name: /^edit supplier$/i }, name: 'edit-supplier-heading' },
      { type: 'text', value: /^edit supplier$/i, name: 'edit-supplier-text' }
    ]
  }
};

module.exports = {
  supplierManagementImremitNewSelectors
};
