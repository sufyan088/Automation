const { test, loadRuntimeData, loginAsAdmin, closeSession, mgmtPaymentsPending5daysHelpers } = require('./_shared');

test("TS_25_To_Verify_that_Program_Type_is_selected_by_default_on_the_Pending_Payments_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/MGMT_Payments_Pending_5Days/TS_25_To_Verify_that_Program_Type_is_selected_by_default_on_the_Pending_Payments_page.ds"
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
