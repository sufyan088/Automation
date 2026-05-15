const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/imREmit_Lite_Dashboard_Partial_Payment_Already_Taken',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-imremit-lite-dashboard-partial-payment-already-taken-shareable',
  zipPathRelative: 'Result/iteration-matrix-imremit-lite-dashboard-partial-payment-already-taken.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=imREmit_Lite_Dashboard_Partial_Payment_Already_Taken module under tests/Iteration_Matrix/imREmit_Lite_Dashboard_Partial_Payment_Already_Taken',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix imREmit_Lite_Dashboard_Partial_Payment_Already_Taken client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  workers: 4,
});

main();