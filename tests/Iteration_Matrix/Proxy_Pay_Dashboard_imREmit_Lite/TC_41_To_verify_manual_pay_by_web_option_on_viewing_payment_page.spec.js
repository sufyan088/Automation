const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TC_41_To_verify_manual_pay_by_web_option_on_viewing_payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite/TC_41_To_verify_manual_pay_by_web_option_on_viewing_payment_page.ds"
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
