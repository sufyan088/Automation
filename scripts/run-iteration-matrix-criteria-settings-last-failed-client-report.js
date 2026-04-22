const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Criteria_Settings',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-criteria-settings-shareable',
  zipPathRelative: 'Result/iteration-matrix-criteria-settings.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Criteria_Settings last-failed rerun merged into Criteria_Settings baseline',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Criteria_Settings last-failed client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
  backupPrefix: 'iteration-matrix-criteria-settings-allure-',
});

main();