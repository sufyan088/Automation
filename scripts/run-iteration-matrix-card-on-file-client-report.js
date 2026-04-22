const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Card_On_File',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-card-on-file-shareable',
  zipPathRelative: 'Result/iteration-matrix-card-on-file.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Card_On_File module under tests/Iteration_Matrix/Card_On_File',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Card_On_File client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();