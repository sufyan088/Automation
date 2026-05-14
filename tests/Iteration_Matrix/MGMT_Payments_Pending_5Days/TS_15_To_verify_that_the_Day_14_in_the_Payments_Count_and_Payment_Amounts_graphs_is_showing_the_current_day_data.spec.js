const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentsPending5daysHelpers } = require('./_shared');

test("TS_15_To_verify_that_the_Day_14_in_the_Payments_Count_and_Payment_Amounts_graphs_is_showing_the_current_day_data", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Pending_5Days/TS_15_To_verify_that_the_Day_14_in_the_Payments_Count_and_Payment_Amounts_graphs_is_showing_the_current_day_data.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtPaymentsPending5daysHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
