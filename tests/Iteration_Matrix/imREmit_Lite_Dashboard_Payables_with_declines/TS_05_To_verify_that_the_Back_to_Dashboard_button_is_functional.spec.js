const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_05_To_verify_that_the_Back_to_Dashboard_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_05_To_verify_that_the_Back_to_Dashboard_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Return from payment management to the dashboard', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickBackToDashboard(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
