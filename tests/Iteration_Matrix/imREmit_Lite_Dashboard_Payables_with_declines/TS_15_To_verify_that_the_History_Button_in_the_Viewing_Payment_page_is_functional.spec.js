const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_15_To_verify_that_the_History_Button_in_the_Viewing_Payment_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_15_To_verify_that_the_History_Button_in_the_Viewing_Payment_page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Payables with Declines list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPaymentDetails(page, data);
  });

  await test.step('Open history in payment details', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.detail.history);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
