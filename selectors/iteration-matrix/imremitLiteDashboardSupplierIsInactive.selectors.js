const { imremitDashboardPayablesEndingInTheNext7DaysSelectors } = require('./imremitDashboardPayablesEndingInTheNext7Days.selectors.js');

const supplierIsInactivePattern = /supplier is inactive/i;
const imremitLiteOverviewPattern = /your imremit overview|your imremit lite overview|imremit\s*\(lite\)|imremit lite/i;

const imremitLiteDashboardSupplierIsInactiveSelectors = {
  ...imremitDashboardPayablesEndingInTheNext7DaysSelectors,
  moduleTabs: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.moduleTabs,
    imremit: [
      { type: 'role', role: 'link', options: { name: /imremit\s*\(lite\)|imremit lite/i }, name: 'imremit-lite-link' },
      { type: 'role', role: 'button', options: { name: /imremit\s*\(lite\)|imremit lite/i }, name: 'imremit-lite-button' },
      { type: 'css', value: 'a[href*="/imremit-lite"], button[aria-label*="imremit lite" i]', name: 'imremit-lite-href' },
      { type: 'text', value: /imremit\s*\(lite\)|imremit lite/i, name: 'imremit-lite-text' }
    ]
  },
  headings: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.headings,
    overview: [
      { type: 'role', role: 'heading', options: { name: imremitLiteOverviewPattern }, name: 'imremit-lite-overview-heading' },
      { type: 'text', value: imremitLiteOverviewPattern, name: 'imremit-lite-overview-text' }
    ],
    advancedSearch: [
      { type: 'role', role: 'heading', options: { name: /advanced search/i }, name: 'advanced-search-heading' },
      { type: 'text', value: /advanced search/i, name: 'advanced-search-text' }
    ]
  },
  dashboard: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard,
    supplierIsInactiveHeading: [
      { type: 'role', role: 'heading', options: { name: supplierIsInactivePattern }, name: 'supplier-is-inactive-heading' },
      { type: 'text', value: supplierIsInactivePattern, name: 'supplier-is-inactive-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: supplierIsInactivePattern }).locator('..').getByText(/^Review$/i).first(),
        name: 'supplier-is-inactive-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: supplierIsInactivePattern }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'supplier-is-inactive-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ]
  },
  list: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.list,
    supplierIsInactiveSummary: [
      { type: 'text', value: supplierIsInactivePattern, name: 'supplier-is-inactive-summary' }
    ],
    startDateAndEndDate: [
      { type: 'role', role: 'button', options: { name: /start date\s*&\s*end date/i }, name: 'date-range-button' },
      { type: 'text', value: /start date\s*&\s*end date/i, name: 'date-range-text' },
      { type: 'css', value: 'button#date', name: 'date-range-id-button' }
    ],
    advancedSearch: [
      { type: 'role', role: 'button', options: { name: /advanced search/i }, name: 'advanced-search-button' },
      { type: 'text', value: /advanced search/i, name: 'advanced-search-button-text' }
    ],
    dashboardFilterLabel: [
      { type: 'label', value: /dashboard filter:?/i, name: 'dashboard-filter-label' },
      { type: 'text', value: /dashboard filter:?/i, name: 'dashboard-filter-text' }
    ],
    dashboardFilterTrigger: [
      { type: 'role', role: 'combobox', options: { name: /dashboard filter/i }, name: 'dashboard-filter-combobox' },
      {
        type: 'custom',
        factory: (page) => page.locator('div').filter({ hasText: /dashboard filter:?/i }).locator('[role="combobox"], button').first(),
        name: 'dashboard-filter-button-near-label'
      },
      {
        type: 'xpath',
        value: "//*[self::label or self::div][contains(normalize-space(), 'Dashboard Filter')]/following::*[@role='combobox' or self::button][1]",
        name: 'dashboard-filter-following-control'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"], [role="combobox"], button').filter({ hasText: /bank recon file not received|supplier is inactive|payments pending for more than 5 days/i }).first(),
        name: 'dashboard-filter-value-button'
      },
      { type: 'text', value: /bank recon file not received|supplier is inactive/i, name: 'dashboard-filter-current-value' }
    ],
    dashboardFilterOption(label) {
      const matcher = label instanceof RegExp ? label : new RegExp(label, 'i');
      return [
        { type: 'role', role: 'option', options: { name: matcher }, name: `dashboard-filter-option-${String(label)}` },
        {
          type: 'custom',
          factory: (page) => page.locator('[role="option"], [cmdk-item], div').filter({ hasText: matcher }).first(),
          name: `dashboard-filter-option-${String(label)}-fallback`
        },
        { type: 'text', value: matcher, name: `dashboard-filter-option-${String(label)}-text` }
      ];
    },
    accountNumberInput: [
      { type: 'placeholder', value: /account number/i, name: 'account-number-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /account number/i }, name: 'account-number-textbox' },
      { type: 'css', value: 'input[placeholder*="Account number" i]', name: 'account-number-input' }
    ],
    paymentNumberInput: [
      { type: 'placeholder', value: /payment number/i, name: 'payment-number-placeholder' },
      { type: 'role', role: 'textbox', options: { name: /payment number/i }, name: 'payment-number-textbox' },
      { type: 'css', value: 'input[placeholder*="Payment number" i]', name: 'payment-number-input' }
    ]
  },
  detail: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail,
    commentSuccessToast: [
      { type: 'text', value: /payment comment added successfully|your comment was added successfully/i, name: 'comment-added-toast' }
    ],
    revealCardDetails: [
      { type: 'role', role: 'button', options: { name: /reveal card details/i }, name: 'reveal-card-details-button' },
      { type: 'text', value: /reveal card details/i, name: 'reveal-card-details-text' }
    ],
    revealedCardNumber: [
      { type: 'text', value: /card number:/i, name: 'revealed-card-number-text' }
    ],
    mapPayment: [
      { type: 'role', role: 'button', options: { name: /map payment/i }, name: 'map-payment-button' },
      { type: 'text', value: /map payment/i, name: 'map-payment-text' }
    ],
    mapPaymentDialogCustomerLabel: [
      { type: 'label', value: /select customer:\*?/i, name: 'map-payment-customer-label' },
      { type: 'text', value: /select customer:\*?/i, name: 'map-payment-customer-text' }
    ]
  }
};

module.exports = {
  imremitLiteDashboardSupplierIsInactiveSelectors
};
