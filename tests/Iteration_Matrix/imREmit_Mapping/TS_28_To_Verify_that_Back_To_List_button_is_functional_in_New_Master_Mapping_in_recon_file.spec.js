const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_28_To_Verify_that_Back_To_List_button_is_functional_in_New_Master_Mapping_in_recon_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_28_To_Verify_that_Back_To_List_button_is_functional_in_New_Master_Mapping_in_recon_file.ds"
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
