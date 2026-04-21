const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_08_To_verify_at_RM_selected_Web_Email_Phone_Primary_Remittance_Method_Field_show_different_fields", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Form/TS_08_To_verify_at_RM_selected_Web_Email_Phone_Primary_Remittance_Method_Field_show_different_fields.ds"
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
