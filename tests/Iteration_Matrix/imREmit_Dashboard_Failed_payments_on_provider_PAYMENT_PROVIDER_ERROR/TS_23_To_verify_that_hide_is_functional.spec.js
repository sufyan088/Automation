const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorHelpers } = require('./_shared');

test("TS_23_To_verify_that_hide_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR/TS_23_To_verify_that_hide_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardFailedPaymentsOnProviderPaymentProviderErrorHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
