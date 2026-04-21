const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_03_To_verify_Review_button_of_Failed_payments_on_IM_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard/Failed_payments_on_IM_IM_ERROR/TS_03_To_verify_Review_button_of_Failed_payments_on_IM_is_functional.ds"
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
