const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_08_To_verify_that_the_next_payment_button_in_viewing_payment_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_08_To_verify_that_the_next_payment_button_in_viewing_payment_page_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Payables Pending for More Than 5 Days list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPaymentDetails(page, data);
  });

  await test.step('Move to the next payment detail', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.clickDetailButton(
      page,
      imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.selectors.detail.nextPayment
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
