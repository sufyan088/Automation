const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/SR_Reporting',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-sr-reporting-shareable',
  zipPathRelative: 'Result/iteration-matrix-sr-reporting.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=SR_Reporting module under tests/Iteration_Matrix/SR_Reporting',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix SR_Reporting client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();