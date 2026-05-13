const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/imREmit_Dashboard_Failed_payments_on_IM_IM_ERROR',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-imremit-dashboard-failed-payments-on-im-im-error-shareable',
  zipPathRelative: 'Result/iteration-matrix-imremit-dashboard-failed-payments-on-im-im-error.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=imREmit_Dashboard_Failed_payments_on_IM_IM_ERROR module under tests/Iteration_Matrix/imREmit_Dashboard_Failed_payments_on_IM_IM_ERROR',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix imREmit_Dashboard_Failed_payments_on_IM_IM_ERROR client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();