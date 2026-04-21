const srUploadNewSelectors = {
  statementReconModule: [
    'a:has-text("Statement Recon")',
    'a[href*="/statement-recon"]'
  ],
  pageHeading: [
    'h1:has-text("Statement Recon")',
    'h2:has-text("Statement Recon")'
  ],
  customerTrigger: [
    'button[role="combobox"]:has-text("Select customer")',
    'button[role="combobox"]'
  ],
  customerSearchInput: [
    'input[placeholder*="Search customers"]'
  ],
  customerOptions: [
    '[role="option"]',
    'div[role="option"] span'
  ],
  supplierSearchInput: [
    'input[placeholder="Search suppliers (min 3 characters)..."]',
    'input[placeholder="Start searching suppliers..."]',
    'input[placeholder*="searching suppliers"]'
  ],
  supplierSection: [
    'input[placeholder="Search suppliers (min 3 characters)..."]',
    '[role="combobox"]:has-text("Search suppliers")',
    'text="Search suppliers (min 3 characters)..."',
    'input[placeholder*="searching suppliers"]'
  ]
};

module.exports = {
  srUploadNewSelectors
};
