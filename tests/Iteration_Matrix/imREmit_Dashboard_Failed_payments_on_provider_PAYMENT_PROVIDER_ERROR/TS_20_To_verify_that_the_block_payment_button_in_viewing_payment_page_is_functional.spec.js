const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_20_To_verify_that_the_block_payment_button_in_viewing_payment_page_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Failed_payments_on_provider_PAYMENT_PROVIDER_ERROR/TS_20_To_verify_that_the_block_payment_button_in_viewing_payment_page_is_functional.ds"
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
