const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_34_To_verify_that_system_excluded_Open_payments_ending_in_next_7_days", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Pending_for_MORE_THAN_5_DAYS_NEW/TS_34_To_verify_that_system_excluded_Open_payments_ending_in_next_7_days.ds"
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
