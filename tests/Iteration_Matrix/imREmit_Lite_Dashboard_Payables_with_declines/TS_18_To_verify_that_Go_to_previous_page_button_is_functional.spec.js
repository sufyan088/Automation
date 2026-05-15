const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_18_To_verify_that_Go_to_previous_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_18_To_verify_that_Go_to_previous_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Move forward and then use the previous-page control', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.pagination.next);
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.pagination.previous);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
