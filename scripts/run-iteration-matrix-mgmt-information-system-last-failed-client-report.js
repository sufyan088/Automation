const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/MGMT_Information_System',
  useExactSpecFiles: true,
  reporters: ['line', 'allure-playwright'],
  shareableDirRelative: 'Result/allure-report-iteration-matrix-mgmt-information-system-shareable',
  zipPathRelative: 'Result/iteration-matrix-mgmt-information-system.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=MGMT_Information_System module under tests/Iteration_Matrix/MGMT_Information_System',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix MGMT_Information_System client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();