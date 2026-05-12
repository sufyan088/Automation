const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/FileProcessing',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-fileprocessing-shareable',
  zipPathRelative: 'Result/iteration-matrix-fileprocessing.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=FileProcessing module under tests/Iteration_Matrix/FileProcessing',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix FileProcessing client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();