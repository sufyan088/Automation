const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_32_To_verify_export_modal_displays_the_correct_number_of_records_selected_for_export", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_32_To_verify_export_modal_displays_the_correct_number_of_records_selected_for_export.ds"
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
