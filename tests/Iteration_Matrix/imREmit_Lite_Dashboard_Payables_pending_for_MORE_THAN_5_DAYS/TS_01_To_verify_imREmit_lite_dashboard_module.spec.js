const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_01_To_verify_imREmit_lite_dashboard_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_01_To_verify_imREmit_lite_dashboard_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the imREmit Lite dashboard workspace', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openDashboardWorkspace(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
