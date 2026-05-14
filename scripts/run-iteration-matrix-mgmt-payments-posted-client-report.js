const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/MGMT_Payments_Posted',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-mgmt-payments-posted-shareable',
  zipPathRelative: 'Result/iteration-matrix-mgmt-payments-posted.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=MGMT_Payments_Posted module under tests/Iteration_Matrix/MGMT_Payments_Posted',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix MGMT_Payments_Posted client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();