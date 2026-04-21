const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_76_To_verify_Automation_Pay_By_Web_option_on_Viewing_payment_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_Dashboard_imREmit_Lite_New/TS_76_To_verify_Automation_Pay_By_Web_option_on_Viewing_payment_page.ds"
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
