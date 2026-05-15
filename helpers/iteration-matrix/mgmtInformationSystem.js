const { wrapHelperMapWithReadableSteps } = require('../clientReadableSteps');
const { mgmtInformationSystemSelectors } = require('../../selectors/iteration-matrix/mgmtInformationSystem.selectors.js');
const { mgmtPaymentReceivedHelpers } = require('./mgmtPaymentReceived.js');
const { mgmtPaymentsPostedHelpers } = require('./mgmtPaymentsPosted.js');
const { mgmtPaymentsPending5daysHelpers } = require('./mgmtPaymentsPending5days.js');
const { mgmtPercentageGrowthHelpers } = require('./mgmtPercentageGrowth.js');

async function openModule(page) {
  return mgmtPaymentReceivedHelpers.openModule(page);
}

async function runScenario(page, data, scenarioName) {
  const title = String(scenarioName || '');
  const testNumber = Number((title.match(/^TS_(\d+)/) || [])[1]);

  if (/Pending_Payments_page/i.test(title) && /table_is_showing_only_current_day_data/i.test(title)) {
    await mgmtPaymentsPending5daysHelpers.runScenario(page, data, 'TS_09');
    return;
  }

  if (testNumber >= 6 && testNumber <= 20) {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, title);
    return;
  }

  if (testNumber >= 21 && testNumber <= 35) {
    const postedScenarioMap = {
      21: 'TS_01',
      22: 'TS_40',
      23: 'TS_02',
      24: 'TS_03',
      25: 'TS_04',
      26: 'TS_05',
      27: 'TS_06',
      28: 'TS_07',
      29: 'TS_08',
      30: 'TS_09',
      31: 'TS_10',
      32: 'TS_11',
      33: 'TS_12',
      34: 'TS_13',
      35: 'TS_14'
    };

    await mgmtPaymentsPostedHelpers.runScenario(page, data, postedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 36 && testNumber <= 39) {
    const postedScenarioMap = {
      36: 'TS_15',
      37: 'TS_16',
      38: 'TS_17',
      39: 'TS_18'
    };

    await mgmtPaymentsPostedHelpers.runScenario(page, data, postedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 40 && testNumber <= 52) {
    await mgmtPercentageGrowthHelpers.runScenario(page, data, `TS_${String(testNumber - 39).padStart(2, '0')}`);
    return;
  }

  if (testNumber === 53 || testNumber === 54) {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, 'TS_46');
    return;
  }

  if (testNumber === 55 || testNumber === 56) {
    const postedScenarioMap = {
      55: 'TS_19',
      56: 'TS_20'
    };

    await mgmtPaymentsPostedHelpers.runScenario(page, data, postedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 57 && testNumber <= 59) {
    const percentageGrowthScenarioMap = {
      57: 'TS_14',
      58: 'TS_15',
      59: 'TS_16'
    };

    await mgmtPercentageGrowthHelpers.runScenario(page, data, percentageGrowthScenarioMap[testNumber]);
    return;
  }

  if (testNumber === 60) {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, 'TS_21');
    return;
  }

  if (testNumber === 61) {
    await mgmtPaymentsPostedHelpers.runScenario(page, data, 'TS_21');
    return;
  }

  if (testNumber === 62) {
    await mgmtPercentageGrowthHelpers.runScenario(page, data, 'TS_17');
    return;
  }

  if (testNumber === 63) {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, 'TS_22');
    return;
  }

  if (testNumber === 64) {
    await mgmtPaymentsPostedHelpers.runScenario(page, data, 'TS_22');
    return;
  }

  if (testNumber === 65) {
    await mgmtPercentageGrowthHelpers.runScenario(page, data, 'TS_18');
    return;
  }

  if (testNumber === 66) {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, 'TS_23');
    return;
  }

  throw new Error(`MGMT_Information_System scenario is not implemented yet: ${title}`);
}

module.exports = {
  mgmtInformationSystemHelpers: wrapHelperMapWithReadableSteps({
    openModule,
    runScenario,
    selectors: mgmtInformationSystemSelectors
  }, {
    runScenario: 'Run the converted MGMT Information System scenario'
  })
};
