const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_39_To_verify_the_data_for_the_Diff_Dates_invoices_on_the_duplicates_tracker_page_for_Initial_Run", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicates_Tracker/TS_39_To_verify_the_data_for_the_Diff_Dates_invoices_on_the_duplicates_tracker_page_for_Initial_Run.ds"
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
