const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichSrSearchNewModuleReport } = require('./sr-search-new-module-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/SR_Search_New_Module',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-sr-search-new-module-shareable',
  zipPathRelative: 'Result/iteration-matrix-sr-search-new-module.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=SR_Search_New_Module under tests/Iteration_Matrix/SR_Search_New_Module',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix SR_Search_New_Module client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  workers: 1,
  postProcessResults: enrichSrSearchNewModuleReport,
});

main();
