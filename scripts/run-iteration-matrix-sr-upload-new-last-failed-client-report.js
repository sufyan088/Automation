const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/SR_Upload_New',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-sr-upload-new-shareable',
  zipPathRelative: 'Result/iteration-matrix-sr-upload-new.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=SR_Upload_New module under tests/Iteration_Matrix/SR_Upload_New',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix SR_Upload_New client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  workers: 1,
  mode: 'last-failed',
});

main();