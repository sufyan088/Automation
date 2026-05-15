const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichProxypayImremitMoudleReport } = require('./proxypay-imremit-moudle-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/ProxyPay_imREmit_Moudle',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-proxypay-imremit-moudle-shareable',
  zipPathRelative: 'Result/iteration-matrix-proxypay-imremit-moudle.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=ProxyPay_imREmit_Moudle module under tests/Iteration_Matrix/ProxyPay_imREmit_Moudle',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix ProxyPay_imREmit_Moudle client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  postProcessResults: enrichProxypayImremitMoudleReport,
  mode: 'last-failed',
});

main();