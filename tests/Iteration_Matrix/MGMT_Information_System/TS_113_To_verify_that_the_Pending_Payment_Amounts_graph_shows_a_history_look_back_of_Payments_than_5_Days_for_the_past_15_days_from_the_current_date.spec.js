const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');
const { mgmtInformationSystemHelpers } = require('../../../helpers/iteration-matrix/mgmtInformationSystem.js');

test("TS_113_To_verify_that_the_Pending_Payment_Amounts_graph_shows_a_history_look_back_of_Payments_than_5_Days_for_the_past_15_days_from_the_current_date", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_113_To_verify_that_the_Pending_Payment_Amounts_graph_shows_a_history_look_back_of_Payments_than_5_Days_for_the_past_15_days_from_the_current_date.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtInformationSystemHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
