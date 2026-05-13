
const customerManagementAdminNmSelectors = {
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
  sections: {
    bankAssociationHeading: [
      { type: 'role', role: 'heading', options: { name: 'Bank Association', exact: true }, name: 'bank-association-heading' },
      { type: 'text', value: 'Bank Association', options: { exact: true }, name: 'bank-association-text' }
    ]
  },
  conditionalFields: {
    bankLabel: [
      { type: 'text', value: 'Bank', options: { exact: true }, name: 'bank-label-text' },
      { type: 'css', value: 'label[for="customerProfile.bankId"]', name: 'bank-label-for' }
    ],
    parentCustomerDropdown: [
      { type: 'role', role: 'button', options: { name: /select parent customer/i }, name: 'parent-customer-button' },
      { type: 'text', value: 'Select parent customer (optional)...', options: { exact: true }, name: 'parent-customer-placeholder' },
      {
        type: 'custom',
        name: 'parent-customer-combobox',
        factory: (page) => page.locator('div').filter({ hasText: /Parent Customer|Select parent customer/i }).locator('[role="combobox"], button').first()
      }
    ],
    parentCustomerDescription: [
      { type: 'text', value: 'This customer belongs to a parent organization', options: { exact: true }, name: 'parent-customer-description' }
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
      { type: 'label', value: 'Customer Phone:', name: 'customer-phone-label' },
      { type: 'placeholder', value: 'Enter phone number...', name: 'customer-phone-number-placeholder' },
      { type: 'placeholder', value: 'Enter the customer phone...', name: 'customer-phone-placeholder' },
      { type: 'css', value: 'input[name="customerProfile.buyerProfilePhone"]', name: 'customer-phone-input' },
      { type: 'css', value: 'input[type="tel"]', name: 'customer-phone-tel-input' },
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
    bank: [
      {
        type: 'custom',
        name: 'bank-combobox-by-label',
        factory: (page) => page.locator('xpath=//label[@for="customerProfile.bankId"]/following::*[@role="combobox" or self::button][1]')
      },
      {
        type: 'custom',
        name: 'bank-combobox-by-text',
        factory: (page) => page.getByRole('combobox').filter({ hasText: /Select a bank|Unidentified|Union Trust Bank|First American Bank/i }).first()
      },
      { type: 'role', role: 'button', options: { name: /select a bank/i }, name: 'select-bank-button' },
      { type: 'text', value: 'Select a bank...', options: { exact: true }, name: 'select-bank-placeholder' }
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
  searchFields: {
    customerList: [
      { type: 'placeholder', value: 'Search all customers...', name: 'search-all-customers' },
      { type: 'placeholder', value: 'Search all entries...', name: 'search-all-entries' }
    ],
    parentCustomerSearch: [
      { type: 'placeholder', value: 'Search customers...', name: 'search-parent-customers' }
    ]
  },
  actionsMenuButton: [
    { type: 'role', role: 'button', options: { name: /actions for|open actions menu|open menu/i }, name: 'actions-menu-button' }
  ],
  actionMenuItems: {
    editCustomerDetails: [
      { type: 'text', value: 'Edit Customer Details', options: { exact: true }, name: 'edit-customer-details' }
    ],
    imREmitEditDetails: [
      { type: 'text', value: 'imREmit Edit Details', options: { exact: true }, name: 'imremit-edit-details' }
    ],
    viewCustomerProfile: [
      { type: 'text', value: 'View Customer Profile', options: { exact: true }, name: 'view-customer-profile' }
    ]
  },
  viewProfile: {
    heading: [
      { type: 'role', role: 'heading', options: { name: 'Customer Profile', exact: true }, name: 'customer-profile-heading' }
    ],
    editCustomerButton: [
      { type: 'role', role: 'link', options: { name: /edit customer/i }, name: 'profile-edit-customer-link' },
      { type: 'text', value: 'Edit Customer', options: { exact: true }, name: 'profile-edit-customer-text' }
    ],
    parentCustomerHeading: [
      { type: 'role', role: 'heading', options: { name: 'Parent Customer', exact: true }, name: 'parent-customer-heading' },
      { type: 'text', value: 'Parent Customer', options: { exact: true }, name: 'parent-customer-heading-text' }
    ]
  },
  bankManagement: {
    addEditButton: [
      { type: 'role', role: 'button', options: { name: /add\/edit banks/i }, name: 'add-edit-banks-button' },
      { type: 'text', value: 'Add/Edit Banks', options: { exact: true }, name: 'add-edit-banks-text' }
    ],
    modalHeading: [
      { type: 'role', role: 'heading', options: { name: 'Add New Bank', exact: true }, name: 'add-new-bank-heading' },
      { type: 'text', value: 'Add New Bank', options: { exact: true }, name: 'add-new-bank-text' }
    ],
    bankNameInput: [
      { type: 'placeholder', value: 'Enter bank name...', name: 'bank-name-placeholder' },
      { type: 'css', value: 'input[name="bankName"]', name: 'bank-name-input' }
    ],
    addButton: [
      { type: 'role', role: 'button', options: { name: /add bank/i }, name: 'add-bank-button' }
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
    paymentProviderDropdown: [
      { type: 'role', role: 'button', options: { name: /select payment provider name/i }, name: 'payment-provider-dropdown' },
      { type: 'role', role: 'combobox', options: { name: /select payment provider name|j\.p\. morgan/i }, name: 'payment-provider-combobox' },
      {
        type: 'custom',
        name: 'payment-provider-control',
        factory: (page) => page.locator('xpath=//div[contains(normalize-space(), "Payment provider name")]/following::*[@role="combobox" or self::button][1]').first()
      }
    ],
    paymentMethodDropdown: [
      { type: 'role', role: 'button', options: { name: /select payment method/i }, name: 'payment-method-dropdown' },
      { type: 'role', role: 'combobox', options: { name: /select payment method|sua/i }, name: 'payment-method-combobox' },
      {
        type: 'custom',
        name: 'payment-method-control',
        factory: (page) => page.locator('xpath=//div[contains(normalize-space(), "Payment method name")]/following::*[@role="combobox" or self::button][1]').first()
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
    nextButton: [
      { type: 'role', role: 'button', options: { name: /^Next\b/i }, name: 'wizard-next-button' },
      {
        type: 'custom',
        name: 'wizard-next-footer-button',
        factory: (page) => page.locator('button').filter({ hasText: /^Next$/ }).last()
      }
    ],
    runnerTypeDropdown: [
      { type: 'role', role: 'button', options: { name: /select runner type/i }, name: 'runner-type-dropdown' },
      { type: 'text', value: 'Select Runner Type...', options: { exact: true }, name: 'runner-type-text' }
    ],
    openReconRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /open recon runner config/i }, name: 'open-recon-runner-config-button' },
      { type: 'text', value: 'Open Recon Runner Config', options: { exact: true }, name: 'open-recon-runner-config-text' }
    ],
    addReconRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /add recon config runner/i }, name: 'add-recon-config-runner-button' },
      { type: 'text', value: 'Add Recon Config Runner', options: { exact: true }, name: 'add-recon-config-runner-text' }
    ],
    completeRunnerConfigButton: [
      { type: 'role', role: 'button', options: { name: /^complete$/i }, name: 'complete-runner-config-button' },
      { type: 'text', value: 'Complete', options: { exact: true }, name: 'complete-runner-config-text' }
    ]
  },
  saveEditedCustomerButton: [
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
  bankToast: [
    { type: 'text', value: 'Bank created successfully', options: { exact: true }, name: 'bank-created-success' },
    { type: 'text', value: 'Bank updated successfully', options: { exact: true }, name: 'bank-updated-success' }
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
  customerManagementAdminNmSelectors
};
