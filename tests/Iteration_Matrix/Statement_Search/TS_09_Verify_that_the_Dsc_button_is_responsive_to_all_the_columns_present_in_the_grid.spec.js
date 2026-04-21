const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_09_Verify_that_the_Dsc_button_is_responsive_to_all_the_columns_present_in_the_grid", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Statement_Search/TS_09_Verify_that_the_Dsc_button_is_responsive_to_all_the_columns_present_in_the_grid.ds"
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
