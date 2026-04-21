const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_25_To_verify_that_add_new_master_mapping_with_Bank_File_in_imREmit_premium_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_25_To_verify_that_add_new_master_mapping_with_Bank_File_in_imREmit_premium_module.ds"
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
