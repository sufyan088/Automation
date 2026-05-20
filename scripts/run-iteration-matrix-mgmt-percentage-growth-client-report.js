const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/MGMT_Percentage_Growth',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-mgmt-percentage-growth-shareable',
  zipPathRelative: 'Result/iteration-matrix-mgmt-percentage-growth.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=MGMT_Percentage_Growth module under tests/Iteration_Matrix/MGMT_Percentage_Growth',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix MGMT_Percentage_Growth client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();