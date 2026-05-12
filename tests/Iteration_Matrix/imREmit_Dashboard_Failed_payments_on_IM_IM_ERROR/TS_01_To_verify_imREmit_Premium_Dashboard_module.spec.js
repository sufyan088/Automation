const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardFailedPaymentsOnImImErrorHelpers } = require('./_shared');

test("TS_01_To_verify_imREmit_Premium_Dashboard_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Failed_payments_on_IM_IM_ERROR/TS_01_To_verify_imREmit_Premium_Dashboard_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardFailedPaymentsOnImImErrorHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
