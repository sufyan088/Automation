const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Onboarding_imREmit_Lite',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-onboarding-imremit-lite-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-onboarding-imremit-lite.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Onboarding_imREmit_Lite module under tests/Iteration_Matrix/Customer_Onboarding_imREmit_Lite',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Onboarding_imREmit_Lite client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();