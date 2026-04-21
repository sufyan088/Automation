const duplicateDashboardNewSelectors = {
  duplicatePaymentsModule: [
    '[href*="/app/duplicate-payments/dashboard"]',
    'a:has-text("Duplicate Payments")',
    'text="Duplicate Payments"'
  ],
  dashboardLink: [
    'a:has-text("Dashboard")',
    'a[href*="/duplicate-payments/dashboard"]',
    'button:has-text("Dashboard")'
  ],
  customerTrigger: [
    '[role="combobox"]:has-text("Select customers")',
    '[role="combobox"]:has-text("Select customer")',
    '[role="combobox"]'
  ],
  customerSearchInput: [
    'input[placeholder*="Search customers"]'
  ],
  customerOptions: [
    '[role="listbox"] [role="option"]',
    '[role="option"]'
  ],
  runTypeTriggers: [
    '[role="combobox"]',
    'button[aria-controls]'
  ],
  runTypeOptions: [
    '[role="listbox"] [role="option"]',
    '[role="option"]'
  ]
};

module.exports = {
  duplicateDashboardNewSelectors
};
