const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_55_To_verify_that_the_Supplier_Admin_role_has_access_to_the_Statement_Recon_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Login/TS_55_To_verify_that_the_Supplier_Admin_role_has_access_to_the_Statement_Recon_module.ds"
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
