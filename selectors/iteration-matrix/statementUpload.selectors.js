const statementUploadSelectors = {
  moduleNavLink: [
    { type: 'role', role: 'link', options: { name: /statement recon/i }, name: 'Statement Recon nav link' },
    { type: 'text', value: /^Statement Recon$/i, name: 'Statement Recon nav text' }
  ],
  moduleHeading: [
    { type: 'role', role: 'heading', options: { name: /statement recon/i }, name: 'Statement Recon heading' },
    { type: 'text', value: /^Statement Recon$/i, name: 'Statement Recon text' }
  ],
  customerTrigger: [
    { type: 'label', value: /select customer/i, name: 'Customer field label' },
    { type: 'role', role: 'combobox', options: { name: /select customer/i }, name: 'Customer combobox' },
    {
      type: 'custom',
      name: 'Customer combobox near label',
      factory: (page) => page.locator('div').filter({ has: page.getByText(/select customer:\*/i) }).locator('[role="combobox"]').first()
    }
  ],
  customerSearchInput: [
    { type: 'placeholder', value: 'Search customers (min. 3 characters)...', name: 'Customer search input' }
  ],
  supplierTrigger: [
    { type: 'label', value: /search suppliers/i, name: 'Supplier field label' },
    { type: 'role', role: 'combobox', options: { name: /search suppliers/i }, name: 'Supplier combobox' },
    { type: 'text', value: /search suppliers \(min 3 characters\)/i, name: 'Supplier trigger text' },
    {
      type: 'custom',
      name: 'Supplier combobox near selected customer',
      factory: (page) => page.locator('div').filter({ has: page.locator('[role="combobox"]').filter({ hasText: /langham logistics/i }) }).locator('[role="combobox"]').nth(1)
    }
  ],
  supplierSearchInput: [
    { type: 'placeholder', value: 'Search suppliers (min 3 characters)...', name: 'Supplier search suppliers input' },
    { type: 'placeholder', value: 'Search items...', name: 'Supplier search items input' },
    { type: 'placeholder', value: 'Start searching suppliers...', name: 'Supplier search input' }
  ],
  plusButton: [
    { type: 'role', role: 'button', options: { name: /^\+$/ }, name: 'Plus icon button' },
    {
      type: 'custom',
      name: 'Plus icon svg button',
      factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-plus') })
    }
  ],
  mappingHeading: [
    { type: 'role', role: 'heading', options: { name: /statement mapping/i }, name: 'Statement Mapping heading' },
    { type: 'text', value: /statement mapping/i, name: 'Statement Mapping text' }
  ],
  dropzone: [
    { type: 'text', value: /drag and drop a file here, or click/i, name: 'Upload dropzone text' },
    { type: 'css', value: 'input[type="file"]', name: 'File input' }
  ],
  fileInput: [
    { type: 'css', value: 'input[type="file"]', name: 'File input' }
  ],
  mappingNameInput: [
    { type: 'placeholder', value: 'Enter mapping name...', name: 'Mapping name input' }
  ],
  dateFormatTrigger: [
    { type: 'label', value: /date format/i, name: 'Date format label' },
    { type: 'role', role: 'combobox', options: { name: /select date format/i }, name: 'Date format combobox' },
    { type: 'role', role: 'button', options: { name: /select date format/i }, name: 'Date format button' },
    {
      type: 'custom',
      name: 'Date format combobox near label',
      factory: (page) => page.locator('div').filter({ has: page.getByText(/date format:\*/i) }).locator('[role="combobox"]').first()
    }
  ],
  useExistingMappingButton: [
    { type: 'role', role: 'button', options: { name: /use existing mapping/i }, name: 'Use Existing Mapping button' },
    { type: 'text', value: /use existing mapping/i, name: 'Use Existing Mapping text' }
  ],
  selectMappingTrigger: [
    { type: 'role', role: 'combobox', options: { name: /select mapping/i }, name: 'Select Mapping combobox' },
    { type: 'role', role: 'button', options: { name: /select mapping/i }, name: 'Select Mapping button' },
    { type: 'text', value: /^Select Mapping$/i, name: 'Select Mapping text' },
    {
      type: 'custom',
      name: 'First reconciliation combobox',
      factory: (page) => page.getByRole('heading', { name: /statement reconciliation/i }).locator('xpath=ancestor::div[1]/following-sibling::div[1]').locator('[role="combobox"]').first()
    }
  ]
};

module.exports = {
  statementUploadSelectors
};
