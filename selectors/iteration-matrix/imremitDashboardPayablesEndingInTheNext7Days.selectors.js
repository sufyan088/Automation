const { imremitDashboardFailedPaymentsOnImImErrorSelectors } = require('./imremitDashboardFailedPaymentsOnImImError.selectors.js');

const payablesEndingPattern = /payables ending in next 7 days|payables ending in the next 7 days/i;

const imremitDashboardPayablesEndingInTheNext7DaysSelectors = {
  ...imremitDashboardFailedPaymentsOnImImErrorSelectors,
  dashboard: {
    ...imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard,
    payablesEndingHeading: [
      { type: 'role', role: 'heading', options: { name: payablesEndingPattern }, name: 'payables-ending-heading' },
      { type: 'text', value: payablesEndingPattern, name: 'payables-ending-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: payablesEndingPattern }).locator('..').getByText(/^Review$/i).first(),
        name: 'payables-ending-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: payablesEndingPattern }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'payables-ending-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ]
  },
  list: {
    ...imremitDashboardFailedPaymentsOnImImErrorSelectors.list,
    payablesEndingSummary: [
      { type: 'text', value: payablesEndingPattern, name: 'payables-ending-summary' }
    ],
    paginationDropdown: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="combobox"]').filter({ hasText: /^\s*10\s*$/ }).first(),
        name: 'pagination-dropdown-combobox-current-page-size'
      },
      { type: 'role', role: 'button', options: { name: /page size|pagination|rows per page/i }, name: 'pagination-dropdown-button' },
      { type: 'css', value: 'button[aria-haspopup="listbox"]', name: 'pagination-dropdown-listbox-button' },
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-chevrons-up-down') }).first(),
        name: 'pagination-dropdown-chevron-button'
      }
    ],
    paginationOption(value) {
      return [
        { type: 'role', role: 'option', options: { name: new RegExp(`^${value}$`) }, name: `pagination-option-${value}` },
        {
          type: 'custom',
          factory: (page) => page.locator('[role="option"], [cmdk-item]').filter({ hasText: new RegExp(`^${value}$`) }).first(),
          name: `pagination-option-${value}-fallback`
        },
        { type: 'text', value: new RegExp(`^${value}$`), name: `pagination-option-${value}-text` }
      ];
    },
    print: [
      { type: 'role', role: 'button', options: { name: /print/i }, name: 'print-button' },
      { type: 'text', value: /^Print$/i, name: 'print-text' }
    ]
  }
};

module.exports = {
  imremitDashboardPayablesEndingInTheNext7DaysSelectors
};
