const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_Verify_that_Admin_can_add_Supplier_in_Supplier_Management_Section", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Management_imREmit_(Premium)/TS_01_Verify_that_Admin_can_add_Supplier_in_Supplier_Management_Section.ds"
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
