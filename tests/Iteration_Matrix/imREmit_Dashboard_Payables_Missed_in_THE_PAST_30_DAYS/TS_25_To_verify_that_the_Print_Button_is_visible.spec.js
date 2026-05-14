const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_25_To_verify_that_the_Print_Button_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_25_To_verify_that_the_Print_Button_is_visible.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables missed list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPayablesMissedList(page, data);
  });

  await test.step('Verify the print control is visible when available', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.assertPrintButtonVisibleWhenAvailable(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
