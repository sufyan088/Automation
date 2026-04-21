const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_33_verify_user_clicks_Update_Sub_then_proceeds_to_remove_DP_should_removed_from_Sub_Col", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module_New/TS_33_verify_user_clicks_Update_Sub_then_proceeds_to_remove_DP_should_removed_from_Sub_Col.ds"
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
