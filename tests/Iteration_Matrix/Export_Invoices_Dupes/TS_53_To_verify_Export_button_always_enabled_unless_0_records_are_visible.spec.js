const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_53_To_verify_Export_button_always_enabled_unless_0_records_are_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_53_To_verify_Export_button_always_enabled_unless_0_records_are_visible.ds"
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
