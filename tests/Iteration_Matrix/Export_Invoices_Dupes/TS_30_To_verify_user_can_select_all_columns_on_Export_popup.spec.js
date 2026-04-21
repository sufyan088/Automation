const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_30_To_verify_user_can_select_all_columns_on_Export_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_30_To_verify_user_can_select_all_columns_on_Export_popup.ds"
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
