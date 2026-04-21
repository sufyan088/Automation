const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_63_To_verify_that_new_column_labeled_Updated_Date_should_be_added_to_data_table_view_in_Proxy_Pay_Dashboard", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/ProxyPay_imREmit_Moudle/TS_63_To_verify_that_new_column_labeled_Updated_Date_should_be_added_to_data_table_view_in_Proxy_Pay_Dashboard.ds"
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
