const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_62_To_verify_number_of_records_exceeds_the_threshold_Download_button_show_as_disabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_62_To_verify_number_of_records_exceeds_the_threshold_Download_button_show_as_disabled.ds"
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
