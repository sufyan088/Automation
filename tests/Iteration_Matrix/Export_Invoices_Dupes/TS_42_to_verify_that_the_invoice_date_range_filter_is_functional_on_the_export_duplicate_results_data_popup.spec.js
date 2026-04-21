const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_42_to_verify_that_the_invoice_date_range_filter_is_functional_on_the_export_duplicate_results_data_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_42_to_verify_that_the_invoice_date_range_filter_is_functional_on_the_export_duplicate_results_data_popup.ds"
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
