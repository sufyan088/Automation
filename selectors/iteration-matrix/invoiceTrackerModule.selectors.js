const invoiceTrackerModuleSelectors = {
  roles: {
    customerAdmin: [
      { type: 'text', value: 'Customer Admin', options: { exact: true }, name: 'customer-admin-role-badge' }
    ],
    supplierUser: [
      { type: 'text', value: 'Supplier User', options: { exact: true }, name: 'supplier-user-role-badge' }
    ]
  },
  customerContext: {
    preselectedCustomer: [
      { type: 'text', value: 'Customer:', options: { exact: false }, name: 'preselected-customer-header' }
    ]
  },
  paymentMethod: {
    label: [
      { type: 'text', value: 'Payment Method', options: { exact: true }, name: 'payment-method-label' }
    ],
    trigger: [
      {
        type: 'custom',
        name: 'payment-method-combobox-after-label',
        factory: (page) => page.getByText('Payment Method', { exact: true }).locator('xpath=following::*[@role="combobox"][1]').first()
      },
      { type: 'role', role: 'button', options: { name: /Select payment methods|Select customers first/i }, name: 'payment-method-trigger-button' },
      { type: 'text', value: 'Select payment methods', options: { exact: false }, name: 'payment-method-enabled-prompt' },
      { type: 'text', value: 'Select customer first', options: { exact: false }, name: 'payment-method-disabled-prompt-singular' },
      { type: 'text', value: 'Select customers first', options: { exact: false }, name: 'payment-method-disabled-prompt-plural' }
    ],
    panelSignals: [
      { type: 'text', value: 'Facilities', options: { exact: true }, name: 'facilities-panel-label' },
      { type: 'placeholder', value: 'Invoice amount...', name: 'invoice-amount-panel-placeholder' },
      { type: 'placeholder', value: 'ERP unique ID...', name: 'erp-unique-id-panel-placeholder' },
      { type: 'placeholder', value: 'Invoice number...', name: 'invoice-number-panel-placeholder' },
      { type: 'placeholder', value: 'PO number...', name: 'po-number-panel-placeholder' }
    ],
    disabledPrompt: [
      { type: 'text', value: 'Select customer first', options: { exact: false }, name: 'payment-method-disabled-prompt-singular' },
      { type: 'text', value: 'Select customers first', options: { exact: false }, name: 'payment-method-disabled-prompt-plural' }
    ]
  },
  advancedSearch: {
    facilitiesTrigger: [
      {
        type: 'custom',
        name: 'facilities-combobox-after-label',
        factory: (page) => page.getByText('Facilities', { exact: true }).locator('xpath=following::*[@role="combobox"][1]').first()
      },
      { type: 'role', role: 'button', options: { name: /Select items/i }, name: 'facilities-trigger-button' },
      { type: 'text', value: 'Select items...', options: { exact: true }, name: 'facilities-trigger-text' }
    ],
    paymentDateButton: [
      { type: 'role', role: 'button', options: { name: /Payment Date/i }, name: 'payment-date-button' },
      { type: 'text', value: 'Payment Date', options: { exact: true }, name: 'payment-date-text' }
    ],
    erpUniqueIdInput: [
      { type: 'placeholder', value: 'ERP unique ID...', name: 'erp-unique-id-placeholder' }
    ],
    invoiceNumberInput: [
      { type: 'placeholder', value: 'Invoice number...', name: 'invoice-number-placeholder' }
    ],
    poNumberInput: [
      { type: 'placeholder', value: 'PO number...', name: 'po-number-placeholder' }
    ]
  }
};

module.exports = {
  invoiceTrackerModuleSelectors
};
