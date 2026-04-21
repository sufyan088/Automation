const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_35_To_verify_that_Sort_Desc_button_is_functional_for_all_columns_present_in_grid", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Invoice_Tracker_New_Module/TS_35_To_verify_that_Sort_Desc_button_is_functional_for_all_columns_present_in_grid.ds"
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
