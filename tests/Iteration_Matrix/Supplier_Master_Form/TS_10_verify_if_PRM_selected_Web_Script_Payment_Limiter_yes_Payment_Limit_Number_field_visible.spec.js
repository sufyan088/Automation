const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_10_verify_if_PRM_selected_Web_Script_Payment_Limiter_yes_Payment_Limit_Number_field_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Form/TS_10_verify_if_PRM_selected_Web_Script_Payment_Limiter_yes_Payment_Limit_Number_field_visible.ds"
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
