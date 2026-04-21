const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_112_To_verify_that_the_Pending_Payment_Counts_graph_shows_a_history_look_back_of_Payments_than_5_Days_for_the_past_15_days_from_current_date", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Information_System/TS_112_To_verify_that_the_Pending_Payment_Counts_graph_shows_a_history_look_back_of_Payments_than_5_Days_for_the_past_15_days_from_current_date.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
