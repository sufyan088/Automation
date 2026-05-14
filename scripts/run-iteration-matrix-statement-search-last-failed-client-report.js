const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichStatementSearchReport } = require('./statement-search-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Statement_Search',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-statement-search-shareable',
  zipPathRelative: 'Result/iteration-matrix-statement-search.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Statement_Search module under tests/Iteration_Matrix/Statement_Search',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Statement_Search client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  postProcessResults: enrichStatementSearchReport,
  mode: 'last-failed',
});

main();