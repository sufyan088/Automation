const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichPmNewModuleReport } = require('./pm-new-module-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/PM_New_Module',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-pm-new-module-shareable',
  zipPathRelative: 'Result/iteration-matrix-pm-new-module.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=PM_New_Module under tests/Iteration_Matrix/PM_New_Module',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix PM_New_Module client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  workers: 1,
  postProcessResults: enrichPmNewModuleReport,
  mode: 'last-failed',
});

main();