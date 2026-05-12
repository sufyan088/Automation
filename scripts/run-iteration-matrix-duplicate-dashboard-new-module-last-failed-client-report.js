const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Duplicate_Dashboard_New_Module',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-duplicate-dashboard-new-module-shareable',
  zipPathRelative: 'Result/iteration-matrix-duplicate-dashboard-new-module.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Duplicate_Dashboard_New_Module under tests/Iteration_Matrix/Duplicate_Dashboard_New_Module',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Duplicate_Dashboard_New_Module client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();
