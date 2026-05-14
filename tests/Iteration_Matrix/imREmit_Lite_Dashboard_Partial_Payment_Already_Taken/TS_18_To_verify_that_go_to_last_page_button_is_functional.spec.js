const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors } = require('./_shared');

test("TS_18_To_verify_that_go_to_last_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_18_To_verify_that_go_to_last_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Partial Payment Already Taken review list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPartialPaymentAlreadyTakenList(page, data);
  });

  await test.step('Use the last-page control when it is enabled', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors.pagination.last);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
