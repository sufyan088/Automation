const { imremitDashboardFailedPaymentsOnImImErrorSelectors } = require('./imremitDashboardFailedPaymentsOnImImError.selectors.js');

const failedPaymentsOnProviderPattern = /failed payments on provider|failed on provider/i;

const imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorSelectors = {
  ...imremitDashboardFailedPaymentsOnImImErrorSelectors,
  dashboard: {
    ...imremitDashboardFailedPaymentsOnImImErrorSelectors.dashboard,
    failedPaymentsHeading: [
      { type: 'role', role: 'heading', options: { name: failedPaymentsOnProviderPattern }, name: 'failed-payments-provider-heading' },
      { type: 'text', value: failedPaymentsOnProviderPattern, name: 'failed-payments-provider-text' }
    ],
    review: [
      {
        type: 'custom',
        factory: (page) => page.getByRole('heading', { name: failedPaymentsOnProviderPattern }).locator('..').getByText(/^Review$/i).first(),
        name: 'failed-payments-provider-review-near-heading'
      },
      {
        type: 'custom',
        factory: (page) => page.locator('h3, [role="heading"]').filter({ hasText: failedPaymentsOnProviderPattern }).locator('..').getByRole('button', { name: /review/i }).first(),
        name: 'failed-payments-provider-review-button'
      },
      { type: 'text', value: /^Review$/i, name: 'review-text' }
    ]
  },
  list: {
    ...imremitDashboardFailedPaymentsOnImImErrorSelectors.list,
    failedPaymentsSummary: [
      { type: 'text', value: failedPaymentsOnProviderPattern, name: 'failed-payments-provider-summary' }
    ]
  }
};

module.exports = {
  imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorSelectors
};
