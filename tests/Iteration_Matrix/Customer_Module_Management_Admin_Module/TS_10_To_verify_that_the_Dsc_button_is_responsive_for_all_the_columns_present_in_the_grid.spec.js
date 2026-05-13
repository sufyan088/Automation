const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminModuleHelpers } = require('./_shared');

test("TS_10_To_verify_that_the_Dsc_button_is_responsive_for_all_the_columns_present_in_the_grid", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module/TS_10_To_verify_that_the_Dsc_button_is_responsive_for_all_the_columns_present_in_the_grid.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminModuleHelpers.runScenario(page, data, 'TS_10_To_verify_that_the_Dsc_button_is_responsive_for_all_the_columns_present_in_the_grid');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
