const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_06_To_verify_that_the_Column_Views_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_06_To_verify_that_the_Column_Views_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Open the column-view control', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openColumnView(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
