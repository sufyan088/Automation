const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_07_To_verify_users_can_select_deselect_individual_columns_in_the_export_modal", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_07_To_verify_users_can_select_deselect_individual_columns_in_the_export_modal.ds"
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
