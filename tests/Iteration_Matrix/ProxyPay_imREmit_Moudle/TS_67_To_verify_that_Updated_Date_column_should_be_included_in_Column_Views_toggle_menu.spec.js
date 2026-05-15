const { test, loadRuntimeData, loginAsAdmin, closeSession, proxypayImremitMoudleHelpers } = require('./_shared');

test("TS_67_To_verify_that_Updated_Date_column_should_be_included_in_Column_Views_toggle_menu", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/ProxyPay_imREmit_Moudle/TS_67_To_verify_that_Updated_Date_column_should_be_included_in_Column_Views_toggle_menu.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await proxypayImremitMoudleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
