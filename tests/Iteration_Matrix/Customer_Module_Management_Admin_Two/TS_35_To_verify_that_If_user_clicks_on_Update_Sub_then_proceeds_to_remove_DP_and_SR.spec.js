const { test, loadRuntimeData, loginAsAdmin, closeSession, customerModuleManagementAdminTwoHelpers } = require('./_shared');

test("TS_35_To_verify_that_If_user_clicks_on_Update_Sub_then_proceeds_to_remove_DP_and_SR", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Two/TS_35_To_verify_that_If_user_clicks_on_Update_Sub_then_proceeds_to_remove_DP_and_SR.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerModuleManagementAdminTwoHelpers.runScenario(page, data, 'TS_35_To_verify_that_If_user_clicks_on_Update_Sub_then_proceeds_to_remove_DP_and_SR');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
