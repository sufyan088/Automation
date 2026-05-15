const { test, loadRuntimeData, loginAsAdmin, closeSession, proxypayImremitMoudleHelpers } = require('./_shared');

test("TS_62_verify_Updated_Date_column_should_display_last_updated_date_in_MM_DD_YYYY_format_for_each_individual_payment_row", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/ProxyPay_imREmit_Moudle/TS_62_verify_Updated_Date_column_should_display_last_updated_date_in_MM_DD_YYYY_format_for_each_individual_payment_row.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxypayImremitMoudleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
