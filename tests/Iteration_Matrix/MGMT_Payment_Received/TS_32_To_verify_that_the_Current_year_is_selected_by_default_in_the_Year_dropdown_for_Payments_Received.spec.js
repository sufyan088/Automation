const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentReceivedHelpers } = require('./_shared');

test("TS_32_To_verify_that_the_Current_year_is_selected_by_default_in_the_Year_dropdown_for_Payments_Received", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payment_Received/TS_32_To_verify_that_the_Current_year_is_selected_by_default_in_the_Year_dropdown_for_Payments_Received.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await mgmtPaymentReceivedHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
