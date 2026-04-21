const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_46_To_verify_default_filename_show_for_dupes_when_user_download_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_46_To_verify_default_filename_show_for_dupes_when_user_download_file.ds"
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
