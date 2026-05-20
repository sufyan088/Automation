const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_02_To_verify_Review_button_is_functional_of_imREmit_with_Decline_block", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_02_To_verify_Review_button_is_functional_of_imREmit_with_Decline_block.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Payables with Declines review list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPayablesWithDeclinesList(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
