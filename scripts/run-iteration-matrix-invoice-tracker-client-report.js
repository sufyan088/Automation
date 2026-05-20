const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Invoice_Tracker',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-invoice-tracker-shareable',
  zipPathRelative: 'Result/iteration-matrix-invoice-tracker.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Invoice_Tracker module under tests/Iteration_Matrix/Invoice_Tracker',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Invoice_Tracker client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();
