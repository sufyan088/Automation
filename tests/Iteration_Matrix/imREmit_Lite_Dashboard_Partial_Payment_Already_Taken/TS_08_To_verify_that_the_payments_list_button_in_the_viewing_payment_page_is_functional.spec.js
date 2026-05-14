const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPartialPaymentAlreadyTakenHelpers, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors } = require('./_shared');

test("TS_08_To_verify_that_the_payments_list_button_in_the_viewing_payment_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Partial_Payment_Already_Taken/TS_08_To_verify_that_the_payments_list_button_in_the_viewing_payment_page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Partial Payment Already Taken list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.openPaymentDetails(page, data);
  });

  await test.step('Return from payment details to the payments list', async () => {
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.clickDetailButton(page, imremitLiteDashboardPartialPaymentAlreadyTakenSelectors.detail.paymentList);
    await imremitLiteDashboardPartialPaymentAlreadyTakenHelpers.assertPaymentManagementVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
