const customerManagementAdminNewSelectors = {
  adminModule: [
    { type: 'role', role: 'link', options: { name: 'Admin', exact: true }, name: 'admin-link' },
    { type: 'css', value: 'a[href="/app/admin"]', name: 'admin-route-link' },
    { type: 'text', value: 'Admin', options: { exact: true }, name: 'admin-text' }
  ],
  customerManagementLink: [
    { type: 'role', role: 'link', options: { name: 'Customer Management', exact: true }, name: 'customer-management-link' },
    { type: 'css', value: 'a[href*="/app/admin/customer-management"]', name: 'customer-management-route' }
  ],
  customerManagementHeading: [
    { type: 'role', role: 'heading', options: { name: 'Customer Management', exact: true }, name: 'customer-management-heading' }
  ],
  addCustomerButton: [
    { type: 'role', role: 'link', options: { name: /add customer/i }, name: 'add-customer-link' },
    { type: 'css', value: 'a[href*="/app/admin/customer-management/create"]', name: 'add-customer-route' }
  ],
  createCustomerHeading: [
    { type: 'role', role: 'heading', options: { name: 'Create Customer', exact: true }, name: 'create-customer-heading' }
  ],
  customerDetailsHeading: [
    { type: 'role', role: 'heading', options: { name: 'Customer Details', exact: true }, name: 'customer-details-heading' }
  ],
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
      { type: 'placeholder', value: 'Enter the customer industry...', name: 'customer-industry-placeholder' }
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
      { type: 'placeholder', value: 'Enter the customer phone...', name: 'customer-phone-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfilePhone"]', name: 'customer-phone-input' },
      { type: 'css', value: '[role="spinbutton"]', name: 'customer-phone-spinbutton' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfilePhone"]', name: 'customer-phone-field' }
    ],
    erpSystem: [
      { type: 'placeholder', value: 'Enter the customer ERP system...', name: 'erp-system-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileReportingTool"]', name: 'erp-system-field' }
    ]
  },
  dropdowns: {
    programManager: [
      {
        type: 'custom',
        name: 'program-manager-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /Program Manager Assigned:/ }).getByRole('combobox').first()
      }
    ],
    country: [
      {
        type: 'custom',
        name: 'country-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /^Country:/ }).getByRole('combobox').first()
      }
    ],
    state: [
      {
        type: 'xpath',
        name: 'state-control-by-label',
        value: "//*[self::div or self::label][normalize-space()='Address state:' or normalize-space()='Address state/province:']/following::*[@role='combobox' or self::button][1]"
      },
      {
        type: 'custom',
        name: 'state-control',
        factory: (page) => page.locator('div').filter({ hasText: /Address state/i }).locator('[role="combobox"], button').first()
      },
      {
        type: 'role',
        role: 'button',
        options: { name: /select address state/i },
        name: 'state-select-placeholder'
      }
    ],
    fileTransmissionMethod: [
      {
        type: 'custom',
        name: 'file-transmission-method-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /File Transmission Method:/ }).getByRole('combobox').first()
      }
    ],
    fileTransmissionType: [
      {
        type: 'custom',
        name: 'file-transmission-type-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /File transmissions:/ }).getByRole('combobox').first()
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
    ]
  },
  submitButton: [
    { type: 'role', role: 'button', options: { name: /create customer/i }, name: 'create-customer-button' },
    { type: 'role', role: 'button', options: { name: /submit form/i }, name: 'submit-form-button' }
  ],
  successToast: [
    { type: 'text', value: 'Customer created successfully', options: { exact: true }, name: 'customer-created-success' },
    { type: 'text', value: 'You successfully created the Customer!', options: { exact: true }, name: 'customer-created-legacy' }
  ],
  labels: {
    selfFundingDescription: 'Enable self-funding for this module subscription',
    selfFundingDisabled: 'Self-funded not enabled',
    selfFundingEnabled: 'Self-funded enabled'
  },
  programManagerOption: 'ammy willson',
  countryOption: 'USA',
  stateOption: 'Alaska',
  fileTransmissionMethodOption: 'sFTP',
  fileTransmissionTypeOption: 'Payment File',
  modules: {
    duplicatePayments: 'Duplicate Payments',
    imREmit: 'ImREmit',
    imREmitLite: 'ImREmit Lite',
    statementRecon: 'Statement Recon'
  }
};

module.exports = {
  customerManagementAdminNewSelectors
};
