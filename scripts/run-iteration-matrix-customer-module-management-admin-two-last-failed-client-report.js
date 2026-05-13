const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Module_Management_Admin_Two',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-module-management-admin-two-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-module-management-admin-two.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Module_Management_Admin_Two module under tests/Iteration_Matrix/Customer_Module_Management_Admin_Two',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Module_Management_Admin_Two client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();