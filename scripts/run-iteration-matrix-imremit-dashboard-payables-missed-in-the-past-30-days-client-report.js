const { createModuleClientReportRunner } = require('./module-client-report-runner');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/imREmit_Dashboard_Payables_Missed_in_THE_PAST_30_DAYS',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-imremit-dashboard-payables-missed-in-the-past-30-days-shareable',
  zipPathRelative: 'Result/iteration-matrix-imremit-dashboard-payables-missed-in-the-past-30-days.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=imREmit_Dashboard_Payables_Missed_in_THE_PAST_30_DAYS module under tests/Iteration_Matrix/imREmit_Dashboard_Payables_Missed_in_THE_PAST_30_DAYS',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix imREmit_Dashboard_Payables_Missed_in_THE_PAST_30_DAYS client report',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  workers: 4,
});

main();
