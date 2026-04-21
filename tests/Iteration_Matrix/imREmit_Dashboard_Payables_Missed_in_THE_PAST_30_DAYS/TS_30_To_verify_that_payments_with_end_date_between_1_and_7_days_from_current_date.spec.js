const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_30_To_verify_that_payments_with_end_date_between_1_and_7_days_from_current_date", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_30_To_verify_that_payments_with_end_date_between_1_and_7_days_from_current_date.ds"
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
