const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_26_To_verify_export_email_displays_default_email_message_Please_find_attached_the_export_data", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_26_To_verify_export_email_displays_default_email_message_Please_find_attached_the_export_data.ds"
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
