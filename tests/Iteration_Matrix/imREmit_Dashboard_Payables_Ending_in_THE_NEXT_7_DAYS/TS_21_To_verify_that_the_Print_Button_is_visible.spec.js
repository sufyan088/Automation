const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesEndingInTheNext7DaysHelpers } = require('./_shared');

test("TS_21_To_verify_that_the_Print_Button_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Ending_in_THE_NEXT_7_DAYS/TS_21_To_verify_that_the_Print_Button_is_visible.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables ending in next 7 days list', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.openPayablesEndingList(page, data);
  });

  await test.step('Verify the Print button is visible when available', async () => {
    await imremitDashboardPayablesEndingInTheNext7DaysHelpers.assertPrintButtonVisibleWhenAvailable(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
