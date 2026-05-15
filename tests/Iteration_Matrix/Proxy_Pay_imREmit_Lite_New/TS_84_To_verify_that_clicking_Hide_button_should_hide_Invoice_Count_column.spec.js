const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitLiteNewHelpers } = require('./_shared');

test("TS_84_To_verify_that_clicking_Hide_button_should_hide_Invoice_Count_column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_Lite_New/TS_84_To_verify_that_clicking_Hide_button_should_hide_Invoice_Count_column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitLiteNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
