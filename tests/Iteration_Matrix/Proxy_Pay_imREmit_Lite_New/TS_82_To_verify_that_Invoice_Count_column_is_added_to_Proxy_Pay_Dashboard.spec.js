const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitLiteNewHelpers } = require('./_shared');

test("TS_82_To_verify_that_Invoice_Count_column_is_added_to_Proxy_Pay_Dashboard", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_Lite_New/TS_82_To_verify_that_Invoice_Count_column_is_added_to_Proxy_Pay_Dashboard.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitLiteNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
