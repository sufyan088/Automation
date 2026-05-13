const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Duplicate_Dashboard_New',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-duplicate-dashboard-new-shareable',
  zipPathRelative: 'Result/iteration-matrix-duplicate-dashboard-new.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Duplicate_Dashboard_New module under tests/Iteration_Matrix/Duplicate_Dashboard_New',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Duplicate_Dashboard_New client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();