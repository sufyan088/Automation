const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_03_To_verify_Review_button_of_imREmit_Pending_for_module_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_03_To_verify_Review_button_of_imREmit_Pending_for_module_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the payables missed review list', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openPayablesMissedList(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
