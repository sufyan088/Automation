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
  const executeScenario = (helper, internalScenarioName = title) => helper.runScenario(page, data, internalScenarioName, title);

  if (/Pending_Payments_page/i.test(title) && /table_is_showing_only_current_day_data/i.test(title)) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_09');
    return;
  }

  if (testNumber >= 6 && testNumber <= 20) {
    await executeScenario(mgmtPaymentReceivedHelpers);
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

    await executeScenario(mgmtPaymentsPostedHelpers, postedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 36 && testNumber <= 39) {
    const postedScenarioMap = {
      36: 'TS_15',
      37: 'TS_16',
      38: 'TS_17',
      39: 'TS_18'
    };

    await executeScenario(mgmtPaymentsPostedHelpers, postedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 40 && testNumber <= 52) {
    await executeScenario(mgmtPercentageGrowthHelpers, `TS_${String(testNumber - 39).padStart(2, '0')}`);
    return;
  }

  if (testNumber === 53 || testNumber === 54) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_46');
    return;
  }

  if (testNumber === 55 || testNumber === 56) {
    const postedScenarioMap = {
      55: 'TS_19',
      56: 'TS_20'
    };

    await executeScenario(mgmtPaymentsPostedHelpers, postedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 57 && testNumber <= 59) {
    const percentageGrowthScenarioMap = {
      57: 'TS_14',
      58: 'TS_15',
      59: 'TS_16'
    };

    await executeScenario(mgmtPercentageGrowthHelpers, percentageGrowthScenarioMap[testNumber]);
    return;
  }

  if (testNumber === 60) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_21');
    return;
  }

  if (testNumber === 61) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_21');
    return;
  }

  if (testNumber === 62) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_17');
    return;
  }

  if (testNumber === 63) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_22');
    return;
  }

  if (testNumber === 64) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_22');
    return;
  }

  if (testNumber === 65) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_18');
    return;
  }

  if (testNumber === 66) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_23');
    return;
  }

  if (testNumber >= 67 && testNumber <= 70) {
    const receivedScenarioMap = {
      67: 'TS_24',
      68: 'TS_25',
      69: 'TS_26',
      70: 'TS_27'
    };

    await executeScenario(mgmtPaymentReceivedHelpers, receivedScenarioMap[testNumber]);
    return;
  }

  if (testNumber >= 71 && testNumber <= 75) {
    await executeScenario(mgmtPaymentsPostedHelpers, `TS_${String(testNumber - 48).padStart(2, '0')}`);
    return;
  }

  if (testNumber >= 76 && testNumber <= 79) {
    await executeScenario(mgmtPercentageGrowthHelpers, `TS_${String(testNumber - 57).padStart(2, '0')}`);
    return;
  }

  if (testNumber >= 80 && testNumber <= 83) {
    await executeScenario(mgmtPaymentReceivedHelpers, `TS_${String(testNumber - 52).padStart(2, '0')}`);
    return;
  }

  if (testNumber >= 84 && testNumber <= 87) {
    await executeScenario(mgmtPaymentsPostedHelpers, `TS_${String(testNumber - 56).padStart(2, '0')}`);
    return;
  }

  if (testNumber >= 88 && testNumber <= 92) {
    await executeScenario(mgmtPaymentReceivedHelpers, `TS_${String(testNumber - 56).padStart(2, '0')}`);
    return;
  }

  if (testNumber >= 93 && testNumber <= 96) {
    await executeScenario(mgmtPaymentsPostedHelpers, `TS_${String(testNumber - 61).padStart(2, '0')}`);
    return;
  }

  if (testNumber >= 97 && testNumber <= 108) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, `TS_${String(testNumber - 96).padStart(2, '0')}`);
    return;
  }

  if (testNumber === 109) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_09');
    return;
  }

  if (testNumber === 111) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_13');
    return;
  }

  if (testNumber === 112) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_32');
    return;
  }

  if (testNumber === 113) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_14');
    return;
  }

  if (testNumber === 114) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_33');
    return;
  }

  if (testNumber >= 115 && testNumber <= 122) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, `TS_${String(testNumber - 99).padStart(2, '0')}`);
    return;
  }

  if (testNumber === 123) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_39');
    return;
  }

  if (testNumber === 124) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_36');
    return;
  }

  if (testNumber === 125) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_37');
    return;
  }

  if (testNumber === 126) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_38');
    return;
  }

  if (testNumber === 127 && /Payments_Posted/i.test(title)) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_37');
    return;
  }

  if (testNumber === 127 && /Percentage_Growth/i.test(title)) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_24');
    return;
  }

  if (testNumber === 128) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_24');
    return;
  }

  if (testNumber === 130) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_40');
    return;
  }

  if (testNumber === 131) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_24');
    return;
  }

  if (testNumber === 132) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_25');
    return;
  }

  if (testNumber === 133) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_26');
    return;
  }

  if (testNumber === 134) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_34');
    return;
  }

  if (testNumber === 135) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_27');
    return;
  }

  if (testNumber === 136) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_35');
    return;
  }

  if (testNumber === 145) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_48');
    return;
  }

  if (testNumber === 146) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_41');
    return;
  }

  if (testNumber === 147) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_23');
    return;
  }

  if (testNumber === 148) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_28');
    return;
  }

  if (testNumber === 149) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_29');
    return;
  }

  if (testNumber === 152) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_44');
    return;
  }

  if (testNumber === 153) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_43');
    return;
  }

  if (testNumber === 154) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_23');
    return;
  }

  if (testNumber === 155) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_24');
    return;
  }

  if (testNumber === 156) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_19');
    return;
  }

  if (testNumber === 157) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_20');
    return;
  }

  if (testNumber === 158) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_30');
    return;
  }

  if (testNumber === 159) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_31');
    return;
  }

  if (testNumber === 160) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_49');
    return;
  }

  if (testNumber === 161) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_42');
    return;
  }

  if (testNumber === 162) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_36');
    return;
  }

  if (testNumber === 163) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_25');
    return;
  }

  if (testNumber === 164) {
    await executeScenario(mgmtPaymentsPostedHelpers, 'TS_43');
    return;
  }

  if (testNumber === 165) {
    await executeScenario(mgmtPercentageGrowthHelpers, 'TS_26');
    return;
  }

  if (testNumber === 166) {
    await executeScenario(mgmtPaymentReceivedHelpers, 'TS_50');
    return;
  }

  if (testNumber === 167) {
    await executeScenario(mgmtPaymentsPending5daysHelpers, 'TS_37');
    return;
  }

  throw new Error(`MGMT_Information_System scenario is not implemented yet: ${title}`);
}

const helperMap = {
  openModule,
  runScenario,
  selectors: mgmtInformationSystemSelectors
};

module.exports = {
  mgmtInformationSystemHelpers: {
    ...wrapHelperMapWithReadableSteps(helperMap),
    runScenario,
    selectors: mgmtInformationSystemSelectors
  }
};
