const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_01_Verify_that_add_new_master_mapping_with_payment file _in_imREmeit_premium_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_01_Verify_that_add_new_master_mapping_with_payment file _in_imREmeit_premium_module.ds"
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
