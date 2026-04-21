const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_To_verify_that_admin_can_add_supplier_in_supplier_management_section_Test", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_Lite/TS_01_To_verify_that_admin_can_add_supplier_in_supplier_management_section_Test.ds"
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
