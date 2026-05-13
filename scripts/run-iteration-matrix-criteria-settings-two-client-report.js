const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichCriteriaSettingsTwoReportSteps } = require('./criteria-settings-two-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Criteria_Settings_Two',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-criteria-settings-two-shareable',
  zipPathRelative: 'Result/iteration-matrix-criteria-settings-two.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Criteria_Settings_Two module under tests/Iteration_Matrix/Criteria_Settings_Two',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Criteria_Settings_Two client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  postProcessResults: enrichCriteriaSettingsTwoReportSteps,
});

main();