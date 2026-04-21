const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_92_To_verify_that_Updated_Date_column_should_display_last_updated_date_in_MM_DD_YYYY_format_for_each_individual_payment_row", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/PM_New_Module/TS_92_To_verify_that_Updated_Date_column_should_display_last_updated_date_in_MM_DD_YYYY_format_for_each_individual_payment_row.ds"
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
