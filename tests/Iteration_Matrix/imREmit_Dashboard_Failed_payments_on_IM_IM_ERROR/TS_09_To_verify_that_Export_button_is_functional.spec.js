const { test, loadRuntimeData, loginAsAdmin, closeSession, imremitDashboardFailedPaymentsOnImImErrorHelpers } = require('./_shared');

test("TS_09_To_verify_that_Export_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Failed_payments_on_IM_IM_ERROR/TS_09_To_verify_that_Export_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await imremitDashboardFailedPaymentsOnImImErrorHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
