const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_09_To_verify_that_the_Previous_Button_in_the_Viewing_Payment_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_09_To_verify_that_the_Previous_Button_in_the_Viewing_Payment_page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Payables with Declines list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPaymentDetails(page, data);
  });

  await test.step('Move to the previous payment detail', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.ensurePreviousPaymentEnabled(page);
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.detail.previousPayment);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
