const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitLiteDashboardPayablesWithDeclinesHelpers } = require('./_shared');

test("TS_16_To_verify_that_payment_can_be_blocked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Lite_Dashboard/Payables_with_declines/TS_16_To_verify_that_payment_can_be_blocked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open payment details from the Payables with Declines list', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.openPaymentDetails(page, data);
  });

  await test.step('Verify the block-payment action is visible', async () => {
    await imremitLiteDashboardPayablesWithDeclinesHelpers.assertBlockPaymentVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
