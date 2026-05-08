const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Onboarding',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-onboarding-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-onboarding.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Onboarding module under tests/Iteration_Matrix/Customer_Onboarding',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Onboarding client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();