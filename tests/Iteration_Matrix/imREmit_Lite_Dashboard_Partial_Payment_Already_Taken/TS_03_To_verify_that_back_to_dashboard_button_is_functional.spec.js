const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers } = require('./_shared');

test("TS_03_To_verify_that_back_to_dashboard_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_03_To_verify_that_back_to_dashboard_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Partial Payment Already Taken review list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPartialPaymentAlreadyTakenList(page, data);
  });

  await test.step('Return from payment management to the dashboard', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.clickBackToDashboard(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
