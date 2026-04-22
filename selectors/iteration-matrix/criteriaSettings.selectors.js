const criteriaSettingsSelectors = {
  duplicatePaymentsModule: [
    'a:has-text("Duplicate Payments")',
    'a[href*="/app/duplicate-payments"]',
    'text="Duplicate Payments"'
  ],
  subrouteNavigation: [
    'nav[aria-label*="DuplicatePayments"]',
    'nav:has(a[href*="/duplicate-payments/criteria-settings"])'
  ],
  criteriaSettingsLink: [
    'a:has-text("Criteria Settings")',
    'a[href*="/duplicate-payments/criteria-settings"]'
  ],
  criteriaSettingsHeading: [
    'h1:has-text("Criteria Settings")',
    'h2:has-text("Criteria Settings")',
    'text="Criteria Settings"'
  ],
  customerCombobox: [
    '[role="combobox"]',
    'button[role="combobox"]'
  ],
  customerSearchInput: [
    '[role="combobox"] input',
    'input[placeholder*="customer"]',
    '[cmdk-input]'
  ],
  customerOptions: [
    '[role="option"]',
    '[cmdk-item]'
  ],
  resultsTable: [
    'table',
    '[role="table"]'
  ],
  searchFields: {
    allEntries: [
      'input[placeholder="Search all entries..."]'
    ],
    character: [
      'input[placeholder="Search character..."]'
    ]
  },
  resetButton: [
    'button:has-text("Reset")',
    'button[class*="destructive"]'
  ],
  paginationSummary: [
    'p:has-text("Page:")'
  ],
  paginationButtons: {
    firstPage: 'Go to first page',
    previousPage: 'Go to previous page',
    nextPage: 'Go to next page',
    lastPage: 'Go to last page'
  },
  columnViewsButton: [
    'button:has-text("Column settings")',
    'button:has-text("Column Order")',
    'button:has(svg.lucide-sliders-horizontal)',
    'button[aria-label*="column"]'
  ],
  criteriaFormButton: [
    'button:has-text("Show Criteria Form")',
    'button:has-text("Hide Criteria Form")'
  ],
  rowActionButtons: [
    'button:has(svg.lucide-grip-vertical)',
    'button[aria-label*="actions"]'
  ],
  submitButton: [
    'button:has-text("Submit")',
    'button[type="submit"]'
  ],
  cancelButton: [
    'button:has-text("Cancel")'
  ],
  toast: [
    '[data-sonner-toast]',
    '[role="status"]'
  ]
};

module.exports = {
  criteriaSettingsSelectors
};
