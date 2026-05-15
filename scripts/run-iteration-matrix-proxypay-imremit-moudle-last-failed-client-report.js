const { createModuleClientReportRunner } = require('./module-client-report-runner');
const { enrichProxypayImremitMoudleReport } = require('./proxypay-imremit-moudle-report-steps');

const main = createModuleClientReportRunner({
  modulePath: 'tests/Iteration_Matrix/Proxy_Pay_imREmit_New',
  useExactSpecFiles: true,
  shareableDirRelative: 'Result/allure-report-iteration-matrix-proxy-pay-imremit-new-shareable',
  zipPathRelative: 'Result/iteration-matrix-proxy-pay-imremit-new.zip',
  environmentLines: [
    'Project=Iteration Matrix',
    'Track=Iteration Matrix',
    'Scope=Proxy_Pay_imREmit_New module under tests/Iteration_Matrix/Proxy_Pay_imREmit_New',
    `Generated=${new Date().toISOString().slice(0, 10)}`,
  ],
  executor: {
    name: 'GitHub Copilot',
    type: 'local',
    buildName: 'Iteration Matrix Proxy_Pay_imREmit_New client report (last failed)',
    buildOrder: 1,
    reportName: 'MAMMOTH-AI'
  },
  postProcessResults: enrichProxypayImremitMoudleReport,
  mode: 'last-failed',
});

main();