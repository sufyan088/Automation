const { test, loadRuntimeData, loginAsAdmin, closeSession, proxypayImremitMoudleHelpers } = require('./_shared');

test("TS_64_To_verify_that_clicking_Asc_button_should_sort_Updated_Date_column_in_Ascending_order", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/ProxyPay_imREmit_Moudle/TS_64_To_verify_that_clicking_Asc_button_should_sort_Updated_Date_column_in_Ascending_order.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxypayImremitMoudleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
