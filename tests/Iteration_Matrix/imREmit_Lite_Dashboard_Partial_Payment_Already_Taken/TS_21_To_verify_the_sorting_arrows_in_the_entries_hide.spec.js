const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors } = require('./_shared');

test("TS_21_To_verify_the_sorting_arrows_in_the_entries_hide", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_21_To_verify_the_sorting_arrows_in_the_entries_hide.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Partial Payment Already Taken review list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPartialPaymentAlreadyTakenList(page, data);
  });

  await test.step('Apply hide-column from the visible table headers', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.applyHeaderActions(page, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors.menus.hideColumn, ['Supplier Name', 'Payment Number', 'Sent Amount']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
