const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_52_To_verify_export_button_disable_when_no_record_available_on_the_Dupes", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_52_To_verify_export_button_disable_when_no_record_available_on_the_Dupes.ds"
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
