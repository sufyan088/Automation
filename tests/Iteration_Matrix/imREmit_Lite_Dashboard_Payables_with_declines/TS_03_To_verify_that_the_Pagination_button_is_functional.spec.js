const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_03_To_verify_that_the_Pagination_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_03_To_verify_that_the_Pagination_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Open the page-size control and choose the supported values', async () => {
    for (const value of ['25', '50', '100', '5', '10']) {
      await imremitLiteDashboardPayablesWithDeclinesHelpers.choosePaginationOption(page, value);
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
