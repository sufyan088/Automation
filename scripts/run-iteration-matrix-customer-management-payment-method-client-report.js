const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Customer_Management_Payment_Method',
  shareableDirRelative: 'Result/allure-report-iteration-matrix-customer-management-payment-method-shareable',
  zipPathRelative: 'Result/iteration-matrix-customer-management-payment-method.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Customer_Management_Payment_Method module under tests/Iteration_Matrix/Customer_Management_Payment_Method',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Customer_Management_Payment_Method client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
});

main();