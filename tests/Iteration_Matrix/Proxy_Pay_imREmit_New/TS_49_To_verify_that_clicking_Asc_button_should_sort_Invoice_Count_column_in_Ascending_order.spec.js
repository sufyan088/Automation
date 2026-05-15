const { test, loadRuntimeData, loginAsAdmin, closeSession, proxyPayImremitNewHelpers } = require('./_shared');

test("TS_49_To_verify_that_clicking_Asc_button_should_sort_Invoice_Count_column_in_Ascending_order", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Proxy_Pay_imREmit_New/TS_49_To_verify_that_clicking_Asc_button_should_sort_Invoice_Count_column_in_Ascending_order.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxyPayImremitNewHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
