const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_25_To_verify_export_email_displays_default_email_subject_Invoice_Tracker_Export", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_25_To_verify_export_email_displays_default_email_subject_Invoice_Tracker_Export.ds"
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
