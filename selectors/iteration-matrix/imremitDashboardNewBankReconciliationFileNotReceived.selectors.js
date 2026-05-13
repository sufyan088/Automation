const { imremitDashboardFailedPaymentsOnImImErrorSelectors } = require('./imremitDashboardFailedPaymentsOnImImError.selectors.js');

const bankReconciliationPattern = /bank reconciliation file not received/i;

const imremitDashboardNewBankReconciliationFileNotReceivedSelectors = {
  ...imremitDashboardFailedPaymentsOnImImErrorSelectors,
  dashboard: {
    ...imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard,
    cardHeading: [
      { type: 'role', role: 'heading', options: { name: bankReconciliationPattern }, name: 'bank-reconciliation-heading' },
      { type: 'text', value: bankReconciliationPattern, name: 'bank-reconciliation-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: bankReconciliationPattern }).locator('..').getByText(/^Review$/i).first(),
        name: 'bank-reconciliation-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: bankReconciliationPattern }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'bank-reconciliation-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ]
  },
  list: {
    ...imremitDashboardFailedPaymentsOnImImErrorSelectors.list,
    cardSummary: [
      { type: 'text', value: bankReconciliationPattern, name: 'bank-reconciliation-summary' }
    ],
    statusDescriptionHeader: [
      { type: 'role', role: 'button', options: { name: /status description/i }, name: 'status-description-button' },
      { type: 'text', value: /status description/i, name: 'status-description-text' }
    ],
    statusDescriptionValue: [
      { type: 'text', value: /bank reconciliation file not receiv/i, name: 'status-description-value' }
    ],
    actionsMenu: [
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-grip-vertical') }).first(),
        name: 'row-actions-grip-vertical-button'
      },
      { type: 'css', value: 'svg.lucide-grip-vertical', name: 'row-actions-grip-vertical-icon' },
      ...imremitDashboardFailedPaymentsOnImImErrorSelectors.list.actionsMenu
    ]
  },
  pagination: {
    pageSizeTrigger: [
      {
        type: 'custom',
        factory: (page) => page.locator('button[role="combobox"]').filter({ hasText: /^10$/ }).first(),
        name: 'page-size-combobox-10'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('span').filter({ hasText: /^10$/ }).first(),
        name: 'page-size-text-10'
      }
    ],
    pageSizeOption(value) {
      return [
        {
          type: 'custom',
          factory: (page) => page.locator('[role="option"], [role="menuitem"]').filter({ hasText: new RegExp(`^${value}$`) }).first(),
          name: `page-size-option-${value}`
        },
        { type: 'text', value: new RegExp(`^${value}$`), name: `page-size-text-${value}` }
      ];
    },
    first: [
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-left-to-line') }).first(),
        name: 'first-page-left-to-line-button'
      },
      { type: 'css', value: 'svg.lucide-arrow-left-to-line', name: 'first-page-left-to-line-icon' },
      ...imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.first
    ],
    previous: [
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-left') }).first(),
        name: 'previous-page-left-button'
      },
      { type: 'css', value: 'svg.lucide-arrow-left', name: 'previous-page-left-icon' },
      ...imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.previous
    ],
    next: [
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-right') }).first(),
        name: 'next-page-right-button'
      },
      { type: 'css', value: 'svg.lucide-arrow-right', name: 'next-page-right-icon' },
      ...imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.next
    ],
    last: [
      {
        type: 'custom',
        factory: (page) => page.locator('button').filter({ has: page.locator('svg.lucide-arrow-right-to-line') }).first(),
        name: 'last-page-right-to-line-button'
      },
      { type: 'css', value: 'svg.lucide-arrow-right-to-line', name: 'last-page-right-to-line-icon' },
      ...imremitDashboardFailedPaymentsOnImImErrorSelectors.pagination.last
    ]
  }
};

module.exports = {
  imremitDashboardNewBankReconciliationFileNotReceivedSelectors
};
