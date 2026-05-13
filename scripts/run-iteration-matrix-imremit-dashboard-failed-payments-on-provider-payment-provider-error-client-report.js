const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/imREmit_Dashboard_Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-imremit-dashboard-failed-payments-on-provider-payment-provider-error-shareable',
  zipPathRelative: 'Result/iteration-matrix-imremit-dashboard-failed-payments-on-provider-payment-provider-error.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=imREmit_Dashboard_Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR module under tests/Iteration_Matrix/imREmit_Dashboard_Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix imREmit_Dashboard_Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();