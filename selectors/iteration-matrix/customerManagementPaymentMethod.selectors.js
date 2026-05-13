const customerManagementPaymentMethodSelectors = {
  adminModule: [
    { type: 'role', role: 'link', options: { name: 'Admin', exact: true }, name: 'admin-link' },
    { type: 'css', value: 'a[href="/app/admin"]', name: 'admin-route-link' },
    { type: 'text', value: 'Admin', options: { exact: true }, name: 'admin-text' }
  ],
  customerManagementLink: [
    { type: 'role', role: 'link', options: { name: 'Customer Management', exact: true }, name: 'customer-management-link' },
    { type: 'css', value: 'a[href*="/app/admin/customer-management"]', name: 'customer-management-route' }
  ],
  addCustomerButton: [
    { type: 'role', role: 'link', options: { name: /add customer/i }, name: 'add-customer-link' },
    { type: 'css', value: 'a[href*="/app/admin/customer-management/create"]', name: 'add-customer-route' }
  ],
  headings: {
    customerManagement: [
      { type: 'role', role: 'heading', options: { name: 'Customer Management', exact: true }, name: 'customer-management-heading' }
    ],
    createCustomer: [
      { type: 'role', role: 'heading', options: { name: 'Create Customer', exact: true }, name: 'create-customer-heading' }
    ],
    customerDetails: [
      { type: 'role', role: 'heading', options: { name: 'Customer Details', exact: true }, name: 'customer-details-heading' }
    ],
    emailConfiguration: [
      { type: 'role', role: 'heading', options: { name: 'Email Configuration', exact: true }, name: 'email-configuration-heading' },
      { type: 'text', value: 'Email Configuration', options: { exact: true }, name: 'email-configuration-text' }
    ],
    paymentMethod: [
      { type: 'role', role: 'heading', options: { name: 'Payment Method', exact: true }, name: 'payment-method-heading' },
      { type: 'text', value: 'Payment Method', options: { exact: true }, name: 'payment-method-text' }
    ]
  },
  fields: {
    customerName: [
      { type: 'placeholder', value: 'Enter the customer name...', name: 'customer-name-placeholder' },
      { type: 'css', value: 'input[name="buyerName"]', name: 'customer-name-field' }
    ],
    companyContactName: [
      { type: 'placeholder', value: 'Enter the customer contact name...', name: 'customer-contact-placeholder' },
      { type: 'placeholder', value: 'Enter the company contact name...', name: 'company-contact-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileContactName"]', name: 'customer-contact-field' }
    ],
    companyIndustry: [
      { type: 'placeholder', value: 'Enter the company industry...', name: 'company-industry-placeholder' },
      { type: 'placeholder', value: 'Enter the customer industry...', name: 'customer-industry-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileIndustry"]', name: 'company-industry-field' }
    ],
    address: [
      { type: 'placeholder', value: 'Enter the address...', name: 'address-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileAddress1"]', name: 'address-field' }
    ],
    city: [
      { type: 'placeholder', value: 'Enter the city...', name: 'city-short-placeholder' },
      { type: 'placeholder', value: 'Enter the address city...', name: 'city-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileAddress2"]', name: 'city-field' }
    ],
    zipCode: [
      { type: 'placeholder', value: 'Enter the zip code...', name: 'zip-code-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileZip"]', name: 'zip-code-field' }
    ],
    email: [
      { type: 'placeholder', value: 'Enter the customer email...', name: 'customer-email-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileEmail"]', name: 'customer-email-field' }
    ],
    phone: [
      { type: 'label', value: 'Customer Phone:', name: 'customer-phone-label' },
      { type: 'placeholder', value: 'Enter phone number...', name: 'customer-phone-number-placeholder' },
      { type: 'placeholder', value: 'Enter the customer phone...', name: 'customer-phone-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfilePhone"]', name: 'customer-phone-field' },
      { type: 'css', value: 'input[type="tel"]', name: 'customer-phone-tel-input' },
      { type: 'css', value: '[role="spinbutton"]', name: 'customer-phone-spinbutton' }
    ],
    erpSystem: [
      { type: 'placeholder', value: 'Enter the customer ERP system...', name: 'erp-system-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileReportingTool"]', name: 'erp-system-field' }
    ],
    customerPaymentMethodName: [
      { type: 'placeholder', value: 'Enter customer payment method name...', name: 'customer-payment-method-name' },
      { type: 'placeholder', value: 'Enter the customer payment method name...', name: 'customer-payment-method-name-alt' }
    ],
    paymentMethodDescription: [
      { type: 'placeholder', value: 'Enter the description...', name: 'payment-method-description' }
    ]
  },
  dropdowns: {
    programManager: [
      {
        type: 'custom',
        name: 'program-manager-combobox',
        factory: (page) => page.locator('xpath=//*[contains(normalize-space(), "Program Manager Assigned:")]/following::*[@role="combobox" or self::button][1]').first()
      }
    ],
    country: [
      {
        type: 'custom',
        name: 'country-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /^Country:/ }).locator('[role="combobox"], button').first()
      }
    ],
    state: [
      {
        type: 'custom',
        name: 'state-control',
        factory: (page) => page.locator('xpath=//*[normalize-space()="Address state:" or normalize-space()="Address state/province:"]/following::*[@role="combobox" or self::button][1]').first()
      },
      { type: 'role', role: 'button', options: { name: /select address state/i }, name: 'state-select-placeholder' }
    ],
    fileTransmissionMethod: [
      {
        type: 'custom',
        name: 'file-transmission-method-combobox',
        factory: (page) => page.locator('xpath=//*[normalize-space()="File Transmission Method:"]/following::*[@role="combobox" or self::button][1]').first()
      }
    ],
    fileTransmissionType: [
      {
        type: 'custom',
        name: 'file-transmission-type-combobox',
        factory: (page) => page.locator('xpath=//*[normalize-space()="File transmissions:"]/following::*[@role="combobox" or self::button][1]').first()
      }
    ],
    moduleSubscription: [
      {
        type: 'custom',
        name: 'module-subscription-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /Available Modules/i }).locator('[role="combobox"], button').first()
      },
      { type: 'placeholder', value: 'Search modules...', name: 'module-search-input' },
      { type: 'text', value: 'Select modules for this customer...', options: { exact: true }, name: 'module-select-placeholder' },
      { type: 'role', role: 'button', options: { name: /select modules/i }, name: 'module-select-button' }
    ],
    paymentProvider: [
      { type: 'role', role: 'button', options: { name: /select payment provider name/i }, name: 'payment-provider-dropdown' },
      { type: 'role', role: 'combobox', options: { name: /select payment provider name|us bank|j\.p\. morgan/i }, name: 'payment-provider-combobox' },
      {
        type: 'custom',
        name: 'payment-provider-control',
        factory: (page) => page.locator('div').filter({ hasText: /Payment provider name:/i }).locator('[role="combobox"], button').first()
      }
    ],
    paymentMethod: [
      { type: 'role', role: 'button', options: { name: /select payment method/i }, name: 'payment-method-dropdown' },
      { type: 'role', role: 'combobox', options: { name: /select payment method|vc|sua/i }, name: 'payment-method-combobox' },
      {
        type: 'custom',
        name: 'payment-method-control',
        factory: (page) => page.locator('xpath=//*[contains(normalize-space(), "Payment method")]/following::*[@role="combobox" or self::button][1]').first()
      }
    ]
  },
  searchFields: {
    customerList: [
      { type: 'placeholder', value: 'Search all customers...', name: 'search-all-customers' },
      { type: 'placeholder', value: 'Search all entries...', name: 'search-all-entries' }
    ]
  },
  submitButton: [
    { type: 'role', role: 'button', options: { name: /create customer/i }, name: 'create-customer-button' },
    { type: 'role', role: 'button', options: { name: /submit form/i }, name: 'submit-form-button' },
    { type: 'role', role: 'button', options: { name: /^create$/i }, name: 'create-generic-button' },
    { type: 'role', role: 'button', options: { name: /^save$/i }, name: 'save-generic-button' },
    {
      type: 'custom',
      name: 'submit-type-button',
      factory: (page) => page.locator('button[type="submit"]').last()
    },
    {
      type: 'custom',
      name: 'primary-form-button',
      factory: (page) => page.locator('main').locator('button').filter({ hasNotText: /logout|return to top|back to list/i }).last()
    }
  ],
  wizard: {
    nextButton: [
      { type: 'role', role: 'button', options: { name: /^Next\b/i }, name: 'wizard-next-button' },
      {
        type: 'custom',
        name: 'wizard-next-footer-button',
        factory: (page) => page.locator('button').filter({ hasText: /^Next$/ }).last()
      },
      { type: 'text', value: 'Next page', options: { exact: true }, name: 'wizard-next-page-text' }
    ],
    savePaymentMethodButton: [
      { type: 'role', role: 'button', options: { name: /save payment method/i }, name: 'save-payment-method-button' },
      { type: 'role', role: 'button', options: { name: /^save$/i }, name: 'save-payment-method-generic' }
    ],
    backToListButton: [
      { type: 'role', role: 'button', options: { name: /back to list/i }, name: 'back-to-list-button' },
      { type: 'text', value: 'Back to list', options: { exact: true }, name: 'back-to-list-text' }
    ]
  },
  actionsMenuItems: {
    imREmitOnboardingPending: [
      { type: 'text', value: 'imREmit Onboarding Pending', options: { exact: true }, name: 'imremit-onboarding-pending' },
      { type: 'text', value: 'imREmit Edit Details', options: { exact: true }, name: 'imremit-edit-details' },
      { type: 'text', value: 'imREmit Customer', options: { exact: true }, name: 'imremit-customer-fallback' },
      { type: 'text', value: 'imREmit', options: { exact: false }, name: 'imremit-generic-fallback' }
    ],
    deleteCustomer: [
      { type: 'text', value: 'Delete Customer', options: { exact: true }, name: 'delete-customer' }
    ]
  },
  dialogs: {
    deleteCustomerConfirmButton: [
      { type: 'role', role: 'button', options: { name: /^Delete /i }, name: 'delete-customer-confirm-button' },
      { type: 'role', role: 'button', options: { name: /delete/i }, name: 'delete-generic-button' }
    ]
  },
  toasts: {
    customerCreated: [
      { type: 'text', value: 'Customer created successfully', options: { exact: true }, name: 'customer-created-success' },
      { type: 'text', value: 'You successfully created the Customer!', options: { exact: true }, name: 'customer-created-legacy' }
    ],
    paymentMethodCreated: [
      { type: 'text', value: 'You successfully added a payment method!', options: { exact: true }, name: 'payment-method-success' }
    ],
    customerDeleted: [
      { type: 'text', value: 'Customer deleted successfully', options: { exact: true }, name: 'customer-deleted-success' }
    ]
  },
  tableValues: {
    paymentProviderCell: (value) => [
      { type: 'role', role: 'cell', options: { name: value, exact: true }, name: `payment-provider-${value}` },
      { type: 'text', value, options: { exact: true }, name: `payment-provider-text-${value}` }
    ],
    paymentMethodCell: (value) => [
      { type: 'role', role: 'cell', options: { name: value, exact: true }, name: `payment-method-${value}` },
      { type: 'text', value, options: { exact: true }, name: `payment-method-text-${value}` }
    ],
    customerPaymentMethodNameCell: (value) => [
      { type: 'role', role: 'cell', options: { name: value, exact: true }, name: `customer-payment-method-${value}` },
      { type: 'text', value, options: { exact: true }, name: `customer-payment-method-text-${value}` }
    ],
    descriptionCell: (value) => [
      { type: 'role', role: 'cell', options: { name: value, exact: true }, name: `description-${value}` },
      { type: 'text', value, options: { exact: true }, name: `description-text-${value}` }
    ]
  },
  defaults: {
    programManagerOption: 'ammy willson',
    countryOption: 'USA',
    stateOption: 'Alaska',
    fileTransmissionMethodOption: 'sFTP',
    fileTransmissionTypeOption: 'Payment File',
    moduleName: 'ImREmit',
    paymentProviderOptions: ['US Bank', 'J.P. Morgan'],
    paymentMethodOptions: ['VC', 'SUA'],
    customerPaymentMethodName: 'Credit Card',
    description: 'This is for test'
  }
};

module.exports = {
  customerManagementPaymentMethodSelectors
};
