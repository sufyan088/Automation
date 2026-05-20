function countryNames(name) {
  if (/^usa$/i.test(name)) {
    return ['USA', 'United States'];
  }

  return [name];
}

const cardOnFileSelectors = {
  moduleEntry: [
    'a:has-text("imREmit")',
    'button:has-text("imREmit")',
    'text=imREmit'
  ],
  moduleHeading: [
    'h1:has-text("imREmit")',
    'main h1:has-text("imREmit")'
  ],
  supplierManagementLink: [
    'a:has-text("Supplier Management")',
    '[role="link"]:has-text("Supplier Management")',
    'a[href*="/supplier-management"]'
  ],
  customerPicker: {
    trigger: [
      'button:has(span:has-text("Select All"))',
      'button:has-text("Select All")',
      'button[min-width]',
      'button:has-text("Select a customer")',
      'button:has-text("Select a customer (min. 3 characters)")'
    ],
    searchInput: [
      'input[placeholder*="Search customers"]',
      'input[placeholder*="customer"]'
    ],
    option: (name) => [
      `[role="option"]:has-text("${name}")`,
      `div[role="option"]:has-text("${name}")`,
      `button:has-text("${name}")`,
      `div:has-text("${name}")`
    ],
    selectedChip: (name) => [
      `span[title="${name}"]`,
      `span:has-text("${name}")`
    ]
  },
  supplierList: {
    searchInput: [
      'input[placeholder="Search all entries..."]',
      'input[placeholder="Search suppliers..."]'
    ],
    table: [
      'table'
    ],
    actionsButton: [
      'button:has(svg.lucide-grip-vertical)',
      'button[aria-haspopup="menu"]',
      'button:has-text("Actions")'
    ],
    editSupplierDetails: [
      'text="Edit Supplier Details"',
      '[role="menuitem"]:has-text("Edit Supplier Details")'
    ]
  },
  editSupplier: {
    heading: [
      'h2:has-text("Edit Supplier")',
      'text="Edit Supplier"'
    ],
    addSupplierHeading: [
      'h1:has-text("Add Supplier")',
      'h2:has-text("Add Supplier")'
    ],
    addSupplierButton: [
      'button:has-text("Add Supplier")',
      'text="Add Supplier"'
    ],
    saveAndContinueButton: [
      'button:has-text("Save and continue")'
    ],
    saveAndSubmitButton: [
      'button:has-text("Save and submit")',
      'button[type="submit"]:has-text("Save and submit")'
    ],
    backToListButton: [
      'text="Back to list"',
      'button:has-text("Back to list")'
    ],
    supplierEnrollmentYes: [
      'button[value="enrolled-yes"]',
      'label[for="enrolled-yes"]',
      '#enrolled-yes'
    ],
    supplierEnrollmentNo: [
      'button[value="enrolled-no"]',
      'label[for="enrolled-no"]',
      '#enrolled-no'
    ],
    singleUseCard: [
      'label[for="single-use-card"]',
      'label:has-text("Single Use Card")'
    ],
    cardOnFile: [
      'label[for="card-on-file"]',
      'label:has-text("Card On File")'
    ],
    cardTypeLabel: [
      'label:has-text("Card Type:*")'
    ],
    cardLimitBufferLabel: [
      'label[for="supplierBufferLimitAmount"]',
      'label:has-text("Card Limit Buffer:")'
    ],
    cardLimitBufferInput: [
      'input[name="supplierBufferLimitAmount"]'
    ],
    cardLimitAmountLabel: [
      'label[for="supplierCardLimitAmount"]',
      'label:has-text("Card Limit Amount:*")'
    ],
    cardLimitAmountInput: [
      'input[name="supplierCardLimitAmount"]',
      'input[placeholder="Enter the card limit amount..."]'
    ],
    flagResetButton: [
      'button:has-text("Flag Reset")'
    ],
    remittanceMethodTrigger: [
      'button:has-text("Select remittance method")',
      'button[role="combobox"]'
    ],
    remittanceMethodOption: (name) => [
      `[role="option"]:has-text("${name}")`,
      `div:has-text("${name}")`
    ],
    supplierContactNameInput: [
      'input[name="supplierContactName"]'
    ],
    contactEmailInput: [
      'input[name="contactEmail"]'
    ],
    taxIdInput: [
      'input[name="taxId"]'
    ],
    validationMessage: (text) => [
      `p:has-text("${text}")`,
      `text="${text}"`
    ],
    supplierNameInput: [
      'input[name="supplierName"]'
    ],
    supplierNumberInput: [
      'input[name="supplierNumber"]'
    ],
    supplierEmailInput: [
      'input[name="supplierEmail"]'
    ],
    phoneNumberInput: [
      'input[name="phoneNumber"]'
    ],
    address1Input: [
      'input[name="address1"]'
    ],
    address2Input: [
      'input[name="address2"]'
    ],
    address3Input: [
      'input[name="address3"]'
    ],
    address4Input: [
      'input[name="address4"]'
    ],
    countryTrigger: [
      'button:has-text("Select Country")',
      'xpath=//label[contains(normalize-space(),"Country")]/following::button[1]',
      'button[role="combobox"]'
    ],
    countryOption: (name) => countryNames(name).flatMap((countryName) => [
      `[role="option"]:has-text("${countryName}")`,
      `button:has-text("${countryName}")`,
      `div:has-text("${countryName}")`
    ]),
    stateTrigger: [
      'button:has-text("Select State")',
      'xpath=//label[contains(normalize-space(),"State")]/following::button[1]'
    ],
    stateOption: (name) => [
      `[role="option"]:has-text("${name}")`,
      `div:has-text("${name}")`
    ],
    cityInput: [
      'input[name="city"]'
    ],
    zipInput: [
      'input[name="zip"]'
    ],
    locationCodeInput: [
      'input[name="locationCode"]'
    ]
  }
};

module.exports = {
  cardOnFileSelectors
};
