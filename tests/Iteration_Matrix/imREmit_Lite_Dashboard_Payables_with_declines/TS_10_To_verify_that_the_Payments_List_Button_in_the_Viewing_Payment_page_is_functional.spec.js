const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_10_To_verify_that_the_Payments_List_Button_in_the_Viewing_Payment_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_10_To_verify_that_the_Payments_List_Button_in_the_Viewing_Payment_page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Payables with Declines list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPaymentDetails(page, data);
  });

  await test.step('Return from payment details to the payments list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.clickDetailButton(page, imremitLiteDashboardPayablesWithDeclinesHelpers.selectors.detail.paymentList);
    await imremitLiteDashboardPayablesWithDeclinesHelpers.assertPaymentManagementVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
