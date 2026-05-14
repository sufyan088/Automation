const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichStatementUploadReport } = require('./statement-upload-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Statement_Upload',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-statement-upload-shareable',
  zipPathRelative: 'Result/iteration-matrix-statement-upload.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Statement_Upload module under tests/Iteration_Matrix/Statement_Upload',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Statement_Upload client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  postProcessResults: enrichStatementUploadReport,
  workers: 1,
  mode: 'last-failed',
});

main();