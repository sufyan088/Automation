const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Module_Management_Admin_Module',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-module-management-admin-module-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-module-management-admin-module.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Module_Management_Admin_Module module under tests/Iteration_Matrix/Customer_Module_Management_Admin_Module',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Module_Management_Admin_Module client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();