const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitLiteNewHelpers } = require('./_shared');

test("TS_93_To_verify_that_user_can_select_multiple_customers_from_Proxy_Pay_Dashboard_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_Lite_New/TS_93_To_verify_that_user_can_select_multiple_customers_from_Proxy_Pay_Dashboard_module.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitLiteNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
