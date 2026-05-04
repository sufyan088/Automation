const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Management_Admin_NM',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-management-admin-nm-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-management-admin-nm.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Management_Admin_NM module under tests/Iteration_Matrix/Customer_Management_Admin_NM',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Management_Admin_NM client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();
