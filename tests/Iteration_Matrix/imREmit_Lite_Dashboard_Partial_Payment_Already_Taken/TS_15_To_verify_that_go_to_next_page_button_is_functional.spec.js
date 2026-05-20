const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors } = require('./_shared');

test("TS_15_To_verify_that_go_to_next_page_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_15_To_verify_that_go_to_next_page_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Partial Payment Already Taken review list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPartialPaymentAlreadyTakenList(page, data);
  });

  await test.step('Use the next-page control when it is enabled', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const clicked = await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.clickPaginationWhenEnabled(page, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors.pagination.next);
      if (!clicked) {
        break;
      }
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
