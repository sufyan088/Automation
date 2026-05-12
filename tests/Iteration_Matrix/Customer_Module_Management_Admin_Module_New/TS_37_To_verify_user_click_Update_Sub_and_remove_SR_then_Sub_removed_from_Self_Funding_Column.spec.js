const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminModuleNewHelpers } = require('./_shared');

test("TS_37_To_verify_user_click_Update_Sub_and_remove_SR_then_Sub_removed_from_Self_Funding_Column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module_New/TS_37_To_verify_user_click_Update_Sub_and_remove_SR_then_Sub_removed_from_Self_Funding_Column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminModuleNewHelpers.runScenario(page, data, 'TS_37_To_verify_user_click_Update_Sub_and_remove_SR_then_Sub_removed_from_Self_Funding_Column');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
