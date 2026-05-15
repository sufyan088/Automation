const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_24_To_verify_the_sorting_arrows_in_the_entries_Desc", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_24_To_verify_the_sorting_arrows_in_the_entries_Desc.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Apply descending order from the visible table headers', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.applyHeaderActions(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.menus.descending, ['Supplier Name', 'Payment Number', 'Sent Date', 'Status Description']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
