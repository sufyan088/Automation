const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardPayablesMissedInThePast30DaysHelpers } = require('./_shared');

test("TS_01_To_verify_imREmit_Premium_Dashboard_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Payables_Missed_in_THE_PAST_30_DAYS/TS_01_To_verify_imREmit_Premium_Dashboard_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit dashboard for the selected customer', async () => {
    await imremitDashboardPayablesMissedInThePast30DaysHelpers.openDashboardWorkspace(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
