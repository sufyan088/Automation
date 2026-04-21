const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_19_To_verify_that_Supplier_Master_Upload_submodule_is_showing_third_for_Supplier_Master_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Supplier_Master_Upload/TS_19_To_verify_that_Supplier_Master_Upload_submodule_is_showing_third_for_Supplier_Master_module.ds"
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
