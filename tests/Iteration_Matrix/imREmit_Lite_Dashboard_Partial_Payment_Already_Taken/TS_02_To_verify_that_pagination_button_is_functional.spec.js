const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers } = require('./_shared');

test("TS_02_To_verify_that_pagination_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_02_To_verify_that_pagination_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Partial Payment Already Taken review list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPartialPaymentAlreadyTakenList(page, data);
  });

  await test.step('Verify the supported page sizes in pagination', async () => {
    for (const value of ['25', '50', '100']) {
      await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.choosePaginationOption(page, value);
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
