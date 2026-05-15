const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_20_To_verify_that_Go_to_the_last_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_20_To_verify_that_Go_to_the_last_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Use the last-page control when it is enabled', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.pagination.last);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
