const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_46_To_verify_that_the_new_master_mapping_can_be_added_with_the_Response_file_using_Fixed_Length", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/imREmit_Mapping/TS_46_To_verify_that_the_new_master_mapping_can_be_added_with_the_Response_file_using_Fixed_Length.ds"
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
