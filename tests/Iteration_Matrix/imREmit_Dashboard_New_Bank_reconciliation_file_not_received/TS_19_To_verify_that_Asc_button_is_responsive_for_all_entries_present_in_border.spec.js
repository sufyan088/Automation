const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_19_To_verify_that_Asc_button_is_responsive_for_all_entries_present_in_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Dashboard_New/Bank_reconciliation_file_not_received/TS_19_To_verify_that_Asc_button_is_responsive_for_all_entries_present_in_border.ds"
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
