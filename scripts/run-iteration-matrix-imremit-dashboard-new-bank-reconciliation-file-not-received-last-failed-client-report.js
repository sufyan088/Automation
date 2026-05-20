const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/imREmit_Dashboard_New_Bank_reconciliation_file_not_received',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-imremit-dashboard-new-bank-reconciliation-file-not-received-shareable',
  zipPathRelative: 'Result/iteration-matrix-imremit-dashboard-new-bank-reconciliation-file-not-received.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=imREmit_Dashboard_New_Bank_reconciliation_file_not_received module under tests/Iteration_Matrix/imREmit_Dashboard_New_Bank_reconciliation_file_not_received',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix imREmit_Dashboard_New_Bank_reconciliation_file_not_received client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();