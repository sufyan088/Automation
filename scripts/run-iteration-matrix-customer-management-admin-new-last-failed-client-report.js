const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Management_Admin_New',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-management-admin-new-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-management-admin-new.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Management_Admin_New module under tests/Iteration_Matrix/Customer_Management_Admin_New',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Management_Admin_New client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  mode: 'last-failed',
});

main();