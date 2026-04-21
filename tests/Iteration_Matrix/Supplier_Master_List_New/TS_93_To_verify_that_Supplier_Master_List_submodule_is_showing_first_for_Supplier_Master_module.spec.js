const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_93_To_verify_that_Supplier_Master_List_submodule_is_showing_first_for_Supplier_Master_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_List_New/TS_93_To_verify_that_Supplier_Master_List_submodule_is_showing_first_for_Supplier_Master_module.ds"
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
