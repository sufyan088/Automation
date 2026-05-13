const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminModuleHelpers } = require('./_shared');

test("TS_11_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module/TS_11_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminModuleHelpers.runScenario(page, data, 'TS_11_To_verify_that_Hide_button_is_responsive_for_all_the_entries_present_in_the_border');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
