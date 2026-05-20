const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/MGMT_Supplier_Transaction_Loss',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-mgmt-supplier-transaction-loss-shareable',
  zipPathRelative: 'Result/iteration-matrix-mgmt-supplier-transaction-loss.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=MGMT_Supplier_Transaction_Loss module under tests/Iteration_Matrix/MGMT_Supplier_Transaction_Loss',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix MGMT_Supplier_Transaction_Loss client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();