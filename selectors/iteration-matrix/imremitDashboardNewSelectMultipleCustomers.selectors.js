const imremitDashboardNewSelectMultipleCustomersSelectors = {
  moduleTabs: {
    imremit: [
      { type: 'role', role: 'link', options: { name: /^imremit( premium)?$/i }, name: 'imremit-link' },
      { type: 'role', role: 'button', options: { name: /^imremit( premium)?$/i }, name: 'imremit-button' },
      { type: 'text', value: /^imremit( premium)?$/i, name: 'imremit-text' }
    ],
    dashboard: [
      { type: 'role', role: 'link', options: { name: /^dashboard$/i }, name: 'dashboard-link' },
      { type: 'role', role: 'button', options: { name: /^dashboard$/i }, name: 'dashboard-button' },
      { type: 'text', value: /^dashboard$/i, name: 'dashboard-text' }
    ],
    paymentManagement: [
      { type: 'role', role: 'link', options: { name: /^payment management$/i }, name: 'payment-management-link' },
      { type: 'role', role: 'button', options: { name: /^payment management$/i }, name: 'payment-management-button' },
      { type: 'text', value: /^payment management$/i, name: 'payment-management-text' }
    ]
  },
  headings: {
    overview: [
      { type: 'role', role: 'heading', options: { name: /your imremit overview/i }, name: 'overview-heading' },
      { type: 'text', value: /your imremit overview/i, name: 'overview-text' }
    ],
    customerDetails: [
      { type: 'role', role: 'heading', options: { name: /^customer details$/i }, name: 'customer-details-heading' },
      { type: 'text', value: /^customer details$/i, name: 'customer-details-text' }
    ]
  },
  customerPicker: {
    trigger: [
      { type: 'role', role: 'button', options: { name: /select customers?/i }, name: 'customer-picker-trigger-select-customers' },
      { type: 'role', role: 'button', options: { name: /^select all$/i }, name: 'customer-picker-trigger-select-all' },
      { type: 'css', value: 'form button[role="combobox"]', name: 'customer-picker-trigger-combobox' },
      { type: 'css', value: 'form button', name: 'customer-picker-trigger-button' }
    ],
    searchInput: [
      { type: 'placeholder', value: /search customers? \(min\. 3 characters\)\.\.\./i, name: 'customer-search-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /search customers?/i }, name: 'customer-search-textbox' },
      { type: 'css', value: 'input[placeholder*="Search customers"]', name: 'customer-search-css' }
    ],
    options: [
      { type: 'role', role: 'option', options: {}, name: 'customer-option-role' },
      { type: 'css', value: '[role="option"]', name: 'customer-option-css-role' },
      { type: 'css', value: '[cmdk-item]', name: 'customer-option-css-cmdk' }
    ],
    selectedLabels: [
      { type: 'text', value: /^cadent$/i, name: 'selected-cadent' },
      { type: 'text', value: /^verizon customer$/i, name: 'selected-verizon-customer' },
      { type: 'text', value: /^select all$/i, name: 'selected-select-all' }
    ]
  },
  dashboard: {
    viewCustomerDetails: [
      { type: 'role', role: 'button', options: { name: /view full customer details/i }, name: 'view-full-customer-details-button' },
      { type: 'text', value: /view full customer details/i, name: 'view-full-customer-details-text' },
      { type: 'role', role: 'button', options: { name: /view customer details/i }, name: 'view-customer-details-button' },
      { type: 'text', value: /view customer details/i, name: 'view-customer-details-text' }
    ],
    customerDetailsPanel: [
      { type: 'role', role: 'heading', options: { name: /^customer details$/i }, name: 'customer-details-panel-heading' },
      { type: 'text', value: /^customer details$/i, name: 'customer-details-panel-text' }
    ],
    customerInformationSection: [
      { type: 'role', role: 'heading', options: { name: /customer information/i }, name: 'customer-information-heading' },
      { type: 'text', value: /customer information/i, name: 'customer-information-text' },
      { type: 'text', value: /view full customer details/i, name: 'view-full-customer-details-marker' }
    ]
  }
};

module.exports = {
  imremitDashboardNewSelectMultipleCustomersSelectors
};
