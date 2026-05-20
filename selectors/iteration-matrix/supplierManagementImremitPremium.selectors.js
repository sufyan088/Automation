const { cardOnFileSelectors } = require('./cardOnFile.selectors.js');

const supplierManagementImremitPremiumSelectors = {
  ...cardOnFileSelectors,
  supplierList: {
    ...cardOnFileSelectors.supplierList,
    viewSupplierDetails: [
      'text="View Supplier Details"',
      '[role="menuitem"]:has-text("View Supplier Details")'
    ],
    deleteSupplier: [
      'text="Delete Supplier"',
      '[role="menuitem"]:has-text("Delete Supplier")'
    ],
    statusButton: [
      'button:has-text("Status")'
    ],
    searchAllEntriesInput: [
      'input[placeholder="Search all entries..."]'
    ],
    searchSuppliersTrigger: [
      '[role="combobox"]:has-text("Select suppliers")',
      'button[role="combobox"]:has-text("Select suppliers")',
      'button:has-text("Search suppliers...")',
      'button:has-text("Search suppliers")'
    ],
    supplierSearchOption: (name) => [
      `[role="option"]:has-text("${name}")`,
      `div[role="option"]:has-text("${name}")`,
      `div:has-text("${name}")`
    ],
    tableStatusBadge: (statusText) => [
      `tbody tr td div:has-text("${statusText}")`,
      `table >> text=${statusText}`
    ],
    pagination: {
      next: [
        'button:has(svg.lucide-arrow-right)',
        'svg.lucide-arrow-right',
        'xpath=//*[contains(normalize-space(),"Page:")]/ancestor::*[1]/preceding-sibling::*[1]//button[last()-1]',
        'button[aria-label*="next" i]'
      ],
      previous: [
        'button:has(svg.lucide-arrow-left)',
        'svg.lucide-arrow-left',
        'xpath=//*[contains(normalize-space(),"Page:")]/ancestor::*[1]/preceding-sibling::*[1]//button[2]',
        'button[aria-label*="previous" i]'
      ],
      first: [
        'button:has(svg.lucide-arrow-left-to-line)',
        'svg.lucide-arrow-left-to-line',
        'xpath=//*[contains(normalize-space(),"Page:")]/ancestor::*[1]/preceding-sibling::*[1]//button[1]',
        'button[aria-label*="first" i]'
      ],
      last: [
        'button:has(svg.lucide-arrow-right-to-line)',
        'svg.lucide-arrow-right-to-line',
        'xpath=//*[contains(normalize-space(),"Page:")]/ancestor::*[1]/preceding-sibling::*[1]//button[last()]',
        'button[aria-label*="last" i]'
      ],
      pageButtons: [
        'xpath=//*[contains(normalize-space(),"Page:")]/ancestor::*[1]/preceding-sibling::*[1]//button',
        'nav[aria-label*="pagination" i] button',
        'button[data-pagination-index]'
      ]
    }
  },
  editSupplier: {
    ...cardOnFileSelectors.editSupplier,
    importScriptButton: [
      'button:has-text("Import Script")',
      'text="Import Script"'
    ],
    importSuppliersButton: [
      'button:has-text("Import suppliers")',
      'text="Import suppliers"'
    ],
    cancelButton: [
      'button:has-text("Cancel")',
      'text="Cancel"'
    ],
    viewSupplierDetailsHeading: [
      'h3:has-text("View Supplier Details")',
      'text="View Supplier Details"'
    ],
    declinedReasonInput: [
      'textarea[name="declinedReason"]'
    ],
    commentsButton: [
      'button:has-text("Comments")',
      'text="Comments"'
    ],
    commentsInput: [
      'textarea[name="comments"]'
    ],
    addRemittanceEmailButton: [
      'xpath=//h3[contains(normalize-space(),"Remittance Email")]/following::*[self::button or @role="button"][1]',
      'button:has-text("Add remittance email")',
      'text="Add remittance email"'
    ],
    addUserCredentialButton: [
      'xpath=//h3[contains(normalize-space(),"User Credentials")]/following::*[self::button or @role="button"][1]'
    ],
    secondRemittanceEmailInput: [
      'input[name="remittanceEmails.1.email"]'
    ],
    userIdInput: [
      'input[placeholder="Enter the user id..."]'
    ],
    userPasswordInput: [
      'input[placeholder="Enter the password..."]'
    ],
    remittanceContactNameInput: [
      'input[placeholder="Enter the contact name..."]'
    ],
    remittanceContactPhoneInput: [
      'input[placeholder="Enter the contact phone..."]'
    ],
    remittanceNameInput: [
      'input[name="remittanceName"]'
    ],
    remittancePhoneNumberInput: [
      'input[name="remittancePhoneNumber"]'
    ],
    confirmationDeleteButton: [
      'button:has-text("Delete")',
      '[role="dialog"] button:has-text("Delete")'
    ]
  },
  filters: {
    statusOption: (name) => [
      `[role="option"]:has-text("${name}")`,
      `div[role="option"]:has-text("${name}")`,
      `span:has-text("${name}")`
    ],
    clearStatus: [
      'div:has-text("Clear")',
      'text="Clear"'
    ],
    advancedSearchButton: [
      'button:has-text("Advanced Search")',
      'text="Advanced Search"'
    ],
    advancedSearchEmailInput: [
      'input[placeholder="Email..."]',
      'input[placeholder="Search email..."]'
    ]
  }
};

module.exports = {
  supplierManagementImremitPremiumSelectors
};
