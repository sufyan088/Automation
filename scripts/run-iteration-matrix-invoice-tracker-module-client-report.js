const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Invoice_Tracker_Module',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-invoice-tracker-module-shareable',
  zipPathRelative: 'Result/iteration-matrix-invoice-tracker-module.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Invoice_Tracker_Module under tests/Iteration_Matrix/Invoice_Tracker_Module',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Invoice_Tracker_Module client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();