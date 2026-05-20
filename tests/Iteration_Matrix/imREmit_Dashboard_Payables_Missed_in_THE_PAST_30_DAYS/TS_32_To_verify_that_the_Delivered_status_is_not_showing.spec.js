const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_32_To_verify_that_the_Delivered_status_is_not_showing", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_32_To_verify_that_the_Delivered_status_is_not_showing.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables missed list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPayablesMissedList(page, data);
  });

  await test.step('Verify Delivered is not shown in payment management', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.assertTextNotVisible(page, 'Delivered');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
