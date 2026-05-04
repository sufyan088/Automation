const customerManagementAdminTwoSelectors = {
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
  editCustomerHeading: [
    { type: 'role', role: 'heading', options: { name: 'Edit Customer', exact: true }, name: 'edit-customer-heading' }
  ],
  customerDetailsHeading: [
    { type: 'role', role: 'heading', options: { name: 'Customer Details', exact: true }, name: 'customer-details-heading' }
  ],
  labels: {
    sso: [
      { type: 'text', value: 'Single Sign-On (SSO)', options: { exact: true }, name: 'sso-label-text' },
      { type: 'css', value: 'label[for="customerProfile.hasSso"]', name: 'sso-label-for' }
    ],
    paymentGroups: [
      { type: 'text', value: 'Payment Group(s)', options: { exact: true }, name: 'payment-groups-label' }
    ],
    paymentRunFrequency: [
      { type: 'text', value: 'Payment run frequency:', options: { exact: true }, name: 'payment-run-frequency-label' }
    ],
    reconciliationFrequency: [
      { type: 'text', value: 'Reconciliation frequency:', options: { exact: true }, name: 'reconciliation-frequency-label' },
      { type: 'text', value: 'Reconciliation Frequency & Time:', options: { exact: true }, name: 'reconciliation-frequency-section' }
    ]
  },
  aliasControls: {
    toggle: [
      { type: 'css', value: '#aliasSwitch', name: 'alias-switch-id' },
      { type: 'role', role: 'button', options: { name: /alias/i }, name: 'alias-toggle-button' }
    ],
    addFirstAliasButton: [
      { type: 'role', role: 'button', options: { name: /add first alias/i }, name: 'add-first-alias-button' },
      { type: 'text', value: 'Add First Alias', options: { exact: true }, name: 'add-first-alias-text' }
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
      { type: 'placeholder', value: 'Enter the customer phone...', name: 'customer-phone-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfilePhone"]', name: 'customer-phone-field' },
      { type: 'css', value: '[role="spinbutton"]', name: 'customer-phone-spinbutton' }
    ],
    erpSystem: [
      { type: 'placeholder', value: 'Enter the customer ERP system...', name: 'erp-system-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfileReportingTool"]', name: 'erp-system-field' }
    ],
    aliases: [
      { type: 'placeholder', value: 'Enter customer aliases...', name: 'customer-aliases-placeholder' },
      { type: 'placeholder', value: 'Enter alias 1...', name: 'customer-aliases-first-placeholder' },
      { type: 'css', value: 'input[name="buyerAliases.0.value"]', name: 'customer-aliases-field' }
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
        factory: (page) => page.locator('div').filter({ hasText: /^Country:/ }).locator('[role="combobox"], button').first()
      }
    ],
    state: [
      {
        type: 'custom',
        name: 'state-control',
        factory: (page) => page.locator('div').filter({ hasText: /Address state/i }).locator('[role="combobox"], button').first()
      },
      { type: 'role', role: 'button', options: { name: /select address state/i }, name: 'state-select-placeholder' }
    ],
    fileTransmissionMethod: [
      {
        type: 'custom',
        name: 'file-transmission-method-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /File Transmission Method:/ }).locator('[role="combobox"], button').first()
      }
    ],
    fileTransmissionType: [
      {
        type: 'custom',
        name: 'file-transmission-type-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /File transmissions:/ }).locator('[role="combobox"], button').first()
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
  searchFields: {
    customerList: [
      { type: 'placeholder', value: 'Search all customers...', name: 'search-all-customers' },
      { type: 'placeholder', value: 'Search all entries...', name: 'search-all-entries' }
    ]
  },
  actionsMenuItems: {
    editCustomerDetails: [
      { type: 'text', value: 'Edit Customer Details', options: { exact: true }, name: 'edit-customer-details' }
    ],
    imREmitEditDetails: [
      { type: 'text', value: 'imREmit Edit Details', options: { exact: true }, name: 'imremit-edit-details' }
    ]
  },
  wizard: {
    emailConfigurationHeading: [
      { type: 'role', role: 'heading', options: { name: 'Email Configuration', exact: true }, name: 'email-configuration-heading' },
      { type: 'text', value: 'Email Configuration', options: { exact: true }, name: 'email-configuration-text' }
    ],
    paymentMethodHeading: [
      { type: 'role', role: 'heading', options: { name: 'Payment Method', exact: true }, name: 'payment-method-heading' },
      { type: 'text', value: 'Payment Method', options: { exact: true }, name: 'payment-method-text' }
    ],
    participantRegisterHeading: [
      { type: 'role', role: 'heading', options: { name: 'Participant Register', exact: true }, name: 'participant-register-heading' },
      { type: 'text', value: 'Participant Register', options: { exact: true }, name: 'participant-register-text' }
    ],
    runnerConfigurationHeading: [
      { type: 'role', role: 'heading', options: { name: 'Runner Configuration', exact: true }, name: 'runner-configuration-heading' },
      { type: 'text', value: 'Runner Configuration', options: { exact: true }, name: 'runner-configuration-text' }
    ],
    nextButton: [
      { type: 'role', role: 'button', options: { name: /^Next\b/i }, name: 'wizard-next-button' },
      {
        type: 'custom',
        name: 'wizard-next-footer-button',
        factory: (page) => page.locator('button').filter({ hasText: /^Next$/ }).last()
      },
      { type: 'text', value: 'Next page', options: { exact: true }, name: 'wizard-next-page-text' }
    ],
    paymentProviderDropdown: [
      { type: 'role', role: 'button', options: { name: /select payment provider name/i }, name: 'payment-provider-dropdown' },
      { type: 'role', role: 'combobox', options: { name: /select payment provider name|j\.p\. morgan/i }, name: 'payment-provider-combobox' },
      {
        type: 'custom',
        name: 'payment-provider-control',
        factory: (page) => page.locator('div').filter({ hasText: /Payment provider name:/i }).locator('[role="combobox"], button').first()
      }
    ],
    paymentMethodDropdown: [
      { type: 'role', role: 'button', options: { name: /select payment method/i }, name: 'payment-method-dropdown' },
      { type: 'role', role: 'combobox', options: { name: /select payment method|sua/i }, name: 'payment-method-combobox' },
      {
        type: 'custom',
        name: 'payment-method-control',
        factory: (page) => page.locator('xpath=//*[normalize-space()="Payment method name:*"]/following::*[@role="combobox" or self::button][1]').first()
      }
    ],
    customerPaymentMethodInput: [
      { type: 'placeholder', value: 'Enter customer payment method name...', name: 'customer-payment-method-name' },
      { type: 'placeholder', value: 'Enter the customer payment method name...', name: 'customer-payment-method-name-alt' }
    ],
    paymentMethodDescriptionInput: [
      { type: 'placeholder', value: 'Enter the description...', name: 'payment-method-description' }
    ],
    savePaymentMethodButton: [
      { type: 'role', role: 'button', options: { name: /save payment method/i }, name: 'save-payment-method-button' },
      { type: 'role', role: 'button', options: { name: /^save$/i }, name: 'save-payment-method-generic' }
    ],
    paymentMethodSuccessToast: [
      { type: 'text', value: 'You successfully added a payment method!', options: { exact: true }, name: 'payment-method-success-toast' }
    ],
    runnerTypeDropdown: [
      { type: 'role', role: 'button', options: { name: /select runner type/i }, name: 'runner-type-dropdown' },
      { type: 'text', value: 'Select Runner Type...', options: { exact: true }, name: 'runner-type-text' }
    ],
    openReconRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /open recon runner config/i }, name: 'open-recon-runner-config-button' },
      { type: 'text', value: 'Open Recon Runner Config', options: { exact: true }, name: 'open-recon-runner-config-text' }
    ],
    openPaymentRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /open payment runner config/i }, name: 'open-payment-runner-config-button' },
      { type: 'text', value: 'Open Payment Runner Config', options: { exact: true }, name: 'open-payment-runner-config-text' }
    ],
    addReconRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /add recon config runner/i }, name: 'add-recon-config-runner-button' },
      { type: 'text', value: 'Add Recon Config Runner', options: { exact: true }, name: 'add-recon-config-runner-text' }
    ],
    addPaymentRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /add payment runner config/i }, name: 'add-payment-runner-config-button' },
      { type: 'text', value: 'Add Payment Runner Config', options: { exact: true }, name: 'add-payment-runner-config-text' }
    ],
    completeRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /^complete$/i }, name: 'complete-runner-config-button' },
      { type: 'text', value: 'Complete', options: { exact: true }, name: 'complete-runner-config-text' }
    ]
  },
  submitButton: [
    { type: 'role', role: 'button', options: { name: /create customer/i }, name: 'create-customer-button' },
    { type: 'role', role: 'button', options: { name: /submit form/i }, name: 'submit-form-button' }
  ],
  updateButton: [
    { type: 'role', role: 'button', options: { name: /save and continue/i }, name: 'save-and-continue-button' },
    { type: 'role', role: 'button', options: { name: /submit form/i }, name: 'edit-submit-form-button' }
  ],
  successToast: [
    { type: 'text', value: 'Customer created successfully', options: { exact: true }, name: 'customer-created-success' },
    { type: 'text', value: 'You successfully created the Customer!', options: { exact: true }, name: 'customer-created-legacy' }
  ],
  updateSuccessToast: [
    { type: 'text', value: 'Customer successfully updated.', options: { exact: true }, name: 'customer-updated-success' },
    { type: 'text', value: 'Success!', options: { exact: true }, name: 'generic-success-title' }
  ],
  programManagerOption: 'ammy willson',
  countryOption: 'USA',
  stateOption: 'Alaska',
  fileTransmissionMethodOption: 'sFTP',
  fileTransmissionTypeOption: 'Payment File',
  modules: {
    imREmit: 'ImREmit',
    imREmitLite: 'ImREmit Lite'
  }
};

module.exports = {
  customerManagementAdminTwoSelectors
};
