const settingsSelectors = {
  statementReconHeading: [
    'h1:has-text("Statement Recon")',
    'text="Statement Recon"'
  ],
  statementReconModule: [
    'a:has-text("Statement Recon")',
    'a[href*="/app/statement-recon"]'
  ],
  subrouteNavigation: [
    'nav[aria-label*="StatementRecon"]',
    'nav:has(a[href*="/statement-recon/settings"])'
  ],
  settingsLink: [
    'a:has-text("Settings")',
    'a[href*="/statement-recon/settings"]'
  ],
  settingsHeading: [
    'h2:has-text("Statement Recon Settings")',
    'text="Statement Recon Settings"'
  ],
  customerCombobox: [
    'button[role="combobox"]',
    '[role="combobox"]'
  ],
  customerSearchInput: [
    'input[placeholder*="customer" i]',
    '[cmdk-input]',
    '[role="combobox"] input'
  ],
  customerOptions: [
    '[role="option"]',
    '[cmdk-item]'
  ],
  searchFields: {
    allEntries: [
      'input[placeholder="Search all entries..."]'
    ],
    character: [
      'input[placeholder="Search character..."]'
    ],
    leadingTrailingType: [
      'input[placeholder="Search leading/trailing type..."]'
    ]
  },
  columnViewsButton: [
    'button:has-text("Column Order")',
    'button:has-text("Column Views")',
    'button[aria-label*="Column settings"]'
  ],
  paginationTrigger: [
    'button[role="combobox"]:has-text("10")',
    'button[role="combobox"]:has-text("25")',
    'button[role="combobox"]:has-text("50")',
    'button[role="combobox"]:has-text("100")'
  ],
  returnToTop: [
    'button:has-text("Return to top")',
    'text="Return to top"'
  ],
  toast: [
    '[data-sonner-toast]',
    '[role="status"]'
  ]
};

module.exports = {
  settingsSelectors
};
