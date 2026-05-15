const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitLiteNewHelpers } = require('./_shared');

test("TS_92_To_verify_that_invalid_or_non_existent_invoice_numbers_return_no_results", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_Lite_New/TS_92_To_verify_that_invalid_or_non_existent_invoice_numbers_return_no_results.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitLiteNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
