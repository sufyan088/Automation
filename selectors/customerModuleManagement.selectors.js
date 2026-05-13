const customerModuleManagementSelectors = {
  selfFundingColumnHeader: [
    { type: 'text', value: 'Self Funding', name: 'text:Self Funding' },
    { type: 'xpath', value: '//table//th[3]//*[text()="Self Funding"]', name: 'xpath:Self Funding header' }
  ],
  columnOrderButton: [
    { type: 'role', role: 'button', options: { name: /column order|column views/i }, name: 'role:Column Order button' },
    { type: 'text', value: 'Column Order', name: 'text:Column Order' },
    { type: 'text', value: 'Column Views', name: 'text:Column Views' }
  ],
  selfFundingColumnOption: [
    { type: 'text', value: 'Self Funding', name: 'text:Self Funding column option' }
  ],
  searchAllEntries: [
    { type: 'placeholder', value: 'Search all entries...', name: 'placeholder:Search all entries' },
    { type: 'css', value: 'input[placeholder="Search all entries..."]', name: 'css:search all entries' }
  ],
  addCustomerButton: [
    { type: 'role', role: 'link', options: { name: /add customer/i }, name: 'role:Add customer link' },
    { type: 'text', value: 'Add customer', name: 'text:Add customer' },
    { type: 'css', value: 'a[href="/app/admin/customer-management/create"]', name: 'css:add customer href' }
  ],
  createCustomerHeading: [
    { type: 'role', role: 'heading', options: { name: 'Create Customer' }, name: 'role:heading Create Customer' },
    { type: 'text', value: 'Create Customer', name: 'text:Create Customer' }
  ],
  customerDetailsHeading: [
    { type: 'role', role: 'heading', options: { name: 'Customer Details' }, name: 'role:heading Customer Details' },
    { type: 'text', value: 'Customer Details', name: 'text:Customer Details' }
  ],
  customerNameInput: [
    { type: 'css', value: 'input[name="buyerName"]', name: 'css:buyerName' },
    { type: 'xpath', value: '//*[@name="buyerName"]', name: 'xpath:buyerName' }
  ],
  programManagerSelect: [
    { type: 'role', role: 'button', options: { name: /select program manager/i }, name: 'role:Program Manager combobox' },
    { type: 'text', value: 'Select Program Manager...', name: 'text:Select Program Manager' }
  ],
  moduleSubscriptionControl: [
    { type: 'custom', factory: (page) => page.getByText('Select modules for this customer...', { exact: true }), name: 'custom:module subscription placeholder' },
    { type: 'custom', factory: (page) => page.locator('button').filter({ hasText: 'Select modules for this customer...' }).first(), name: 'custom:module subscription button' }
  ],
  createCustomerSubmit: [
    { type: 'role', role: 'button', options: { name: /create customer/i }, name: 'role:Create Customer button' },
    { type: 'text', value: 'Create customer', name: 'text:Create customer' },
    { type: 'text', value: 'Submit form', name: 'text:Submit form' }
  ],
  customerCreatedToast: [
    { type: 'text', value: 'Customer created successfully', name: 'text:Customer created successfully' },
    { type: 'text', value: 'You successfully created the Customer!', name: 'text:created toast' }
  ],
  updateSubscriptionButton: [
    { type: 'role', role: 'button', options: { name: /update subscription/i }, name: 'role:Update Subscription' },
    { type: 'text', value: 'Update Subscription', name: 'text:Update Subscription' },
    { type: 'xpath', value: '//table//tbody//tr[1]//button[.//*[text()="Update Subscription"] or contains(.,"Update Subscription")]', name: 'xpath:first Update Subscription button' }
  ],
  updateButton: [
    { type: 'role', role: 'button', options: { name: /^update$/i }, name: 'role:Update button' },
    { type: 'text', value: 'Update', name: 'text:Update' }
  ],
  noDataBadge: [
    { type: 'text', value: 'No data', name: 'text:No data' },
    { type: 'xpath', value: '//table//tbody//tr[1]//td[3]//*[text()="No data"]', name: 'xpath:No data badge in self funding column' }
  ]
};

module.exports = { customerModuleManagementSelectors };