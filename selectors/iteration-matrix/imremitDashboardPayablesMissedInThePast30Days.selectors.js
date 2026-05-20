const { imremitDashboardPayablesEndingInTheNext7DaysSelectors } = require('./imremitDashboardPayablesEndingInTheNext7Days.selectors.js');

const payablesMissedPattern = /payables missed past card end date|payables missed in the past 30 days|payables missed/i;

const imremitDashboardPayablesMissedInThePast30DaysSelectors = {
  ...imremitDashboardPayablesEndingInTheNext7DaysSelectors,
  dashboard: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.dashboard,
    payablesMissedHeading: [
      { type: 'role', role: 'heading', options: { name: payablesMissedPattern }, name: 'payables-missed-heading' },
      { type: 'text', value: payablesMissedPattern, name: 'payables-missed-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: payablesMissedPattern }).locator('..').getByText(/^Review$/i).first(),
        name: 'payables-missed-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: payablesMissedPattern }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'payables-missed-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ]
  },
  list: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.list,
    payablesMissedSummary: [
      { type: 'text', value: payablesMissedPattern, name: 'payables-missed-summary' }
    ],
    statusControl: [
      { type: 'role', role: 'button', options: { name: /status/i }, name: 'status-button' },
      { type: 'text', value: /^status$/i, name: 'status-text' }
    ]
  },
  detail: {
    ...imremitDashboardPayablesEndingInTheNext7DaysSelectors.detail,
    totalAmountSentLabel: [
      { type: 'text', value: /total amount sent/i, name: 'total-amount-sent-label' }
    ],
    amountTakenLabel: [
      { type: 'text', value: /amount taken/i, name: 'amount-taken-label' }
    ]
  }
};

module.exports = {
  imremitDashboardPayablesMissedInThePast30DaysSelectors
};
