const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers } = require('./_shared');

test("TS_16_To_verify_that_payment_can_be_blocked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_pending_for_MORE_THAN_5_DAYS/TS_16_To_verify_that_payment_can_be_blocked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Payables Pending for More Than 5 Days list', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.openPaymentDetails(page, data);
  });

  await test.step('Verify the block-payment action is visible', async () => {
    await imremitLiteDashboardPayablesPendingForMoreThan5DaysHelpers.assertBlockPaymentVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
