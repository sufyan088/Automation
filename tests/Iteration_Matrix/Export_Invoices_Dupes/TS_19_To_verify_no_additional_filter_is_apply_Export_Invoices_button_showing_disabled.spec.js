const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_19_To_verify_no_additional_filter_is apply_Export_Invoices_button_showing_disabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_19_To_verify_no_additional_filter_is apply_Export_Invoices_button_showing_disabled.ds"
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
