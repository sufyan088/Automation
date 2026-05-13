const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Module_Management_Admin_Module_New',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-module-management-admin-module-new-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-module-management-admin-module-new.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Module_Management_Admin_Module_New module under tests/Iteration_Matrix/Customer_Module_Management_Admin_Module_New',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Module_Management_Admin_Module_New client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();