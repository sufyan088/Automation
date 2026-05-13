const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Runner_Configuration',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-runner-configuration-shareable',
  zipPathRelative: 'Result/iteration-matrix-runner-configuration.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Runner_Configuration module under tests/Iteration_Matrix/Runner_Configuration',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Runner_Configuration client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();