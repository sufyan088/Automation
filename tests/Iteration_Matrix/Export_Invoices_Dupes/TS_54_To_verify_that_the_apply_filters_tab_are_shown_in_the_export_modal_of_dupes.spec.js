const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_54_To_verify_that_the_apply_filters_tab_are_shown_in_the_export_modal_of_dupes", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Export_Invoices_Dupes/TS_54_To_verify_that_the_apply_filters_tab_are_shown_in_the_export_modal_of_dupes.ds"
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
