const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/SR_Reporting_New',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-sr-reporting-new-shareable',
  zipPathRelative: 'Result/iteration-matrix-sr-reporting-new.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=SR_Reporting_New module under tests/Iteration_Matrix/SR_Reporting_New',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix SR_Reporting_New client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();