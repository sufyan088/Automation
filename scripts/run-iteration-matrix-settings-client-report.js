const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Settings',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-settings-shareable',
  zipPathRelative: 'Result/iteration-matrix-settings.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Settings module under tests/Iteration_Matrix/Settings',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Settings client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();