const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_04_Verify_that_Cancel_button_with_payment_file_in_New_master_mapping_page_in_imREmit_premium_module", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_04_Verify_that_Cancel_button_with_payment_file_in_New_master_mapping_page_in_imREmit_premium_module.ds"
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
