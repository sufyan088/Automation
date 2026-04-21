const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_37_verify_that_Program_Manager_has_access_t0_view_supplier_when_supplier_status", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_List/TS_37_verify_that_Program_Manager_has_access_t0_view_supplier_when_supplier_status.ds"
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
