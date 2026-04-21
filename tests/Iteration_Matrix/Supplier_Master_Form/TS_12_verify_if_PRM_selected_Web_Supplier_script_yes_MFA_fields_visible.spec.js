const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_12_verify_if_PRM_selected_Web_Supplier_script_yes_MFA_fields_visible", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Form/TS_12_verify_if_PRM_selected_Web_Supplier_script_yes_MFA_fields_visible.ds"
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
