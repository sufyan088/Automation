const { imremitDashboardPayablesEndingInTheNext7DaysSelectors } = require('./imremitDashboardPayablesEndingInTheNext7Days.selectors.js');

const payablesPendingForMoreThan5DaysPattern = /payables pending for more than 5 days/i;
const imremitLiteOverviewPattern = /your imremit overview|your imremit lite overview|imremit\s*\(lite\)|imremit lite/i;

const imremitLiteDashboardPayablesPendingForMoreThan5DaysSelectors = {
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
    ]
  },
  dashboard: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard,
    payablesPendingForMoreThan5DaysHeading: [
      { type: 'role', role: 'heading', options: { name: payablesPendingForMoreThan5DaysPattern }, name: 'payables-pending-more-than-5-days-heading' },
      { type: 'text', value: payablesPendingForMoreThan5DaysPattern, name: 'payables-pending-more-than-5-days-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: payablesPendingForMoreThan5DaysPattern }).locator('..').getByText(/^Review$/i).first(),
        name: 'payables-pending-more-than-5-days-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: payablesPendingForMoreThan5DaysPattern }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'payables-pending-more-than-5-days-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ]
  },
  list: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.list,
    payablesPendingForMoreThan5DaysSummary: [
      { type: 'text', value: payablesPendingForMoreThan5DaysPattern, name: 'payables-pending-more-than-5-days-summary' }
    ],
    paginationDropdown: [
      {
        type: 'custom',
        factory: (page) => page.locator('[role="combobox"]').filter({ hasText: /^\s*(5|10|25|50|100)\s*$/ }).first(),
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
          factory: (page) => page.locator('[role="option"], [cmdk-item], div').filter({ hasText: new RegExp(`^${value}$`) }).first(),
          name: `pagination-option-${value}-fallback`
        },
        { type: 'text', value: new RegExp(`^${value}$`), name: `pagination-option-${value}-text` }
      ];
    }
  }
};

module.exports = {
  imremitLiteDashboardPayablesPendingForMoreThan5DaysSelectors
};
