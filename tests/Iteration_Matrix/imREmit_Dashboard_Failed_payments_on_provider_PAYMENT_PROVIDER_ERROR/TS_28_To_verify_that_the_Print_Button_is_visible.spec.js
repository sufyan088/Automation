const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_28_To_verify_that_the_Print_Button_is_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR/TS_28_To_verify_that_the_Print_Button_is_visible.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
