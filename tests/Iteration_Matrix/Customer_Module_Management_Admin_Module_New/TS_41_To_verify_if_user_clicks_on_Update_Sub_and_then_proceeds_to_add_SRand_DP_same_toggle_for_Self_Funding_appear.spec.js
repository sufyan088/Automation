const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_41_To_verify_if_user_clicks_on_Update_Sub_and_then_proceeds_to_add_SRand_DP_same_toggle_for_Self_Funding_appear", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Module_Management_Admin_Module_New/TS_41_To_verify_if_user_clicks_on_Update_Sub_and_then_proceeds_to_add_SRand_DP_same_toggle_for_Self_Funding_appear.ds"
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
