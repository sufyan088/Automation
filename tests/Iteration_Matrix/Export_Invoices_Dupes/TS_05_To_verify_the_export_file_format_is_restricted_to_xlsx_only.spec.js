const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_05_To_verify_the_export_file_format_is_restricted_to_xlsx_only", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_05_To_verify_the_export_file_format_is_restricted_to_xlsx_only.ds"
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
