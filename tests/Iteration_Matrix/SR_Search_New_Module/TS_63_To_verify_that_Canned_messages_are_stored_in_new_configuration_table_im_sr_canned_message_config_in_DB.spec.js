const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_63_To_verify_that_Canned_messages_are_stored_in_new_configuration_table_im_sr_canned_message_config_in_DB", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_63_To_verify_that_Canned_messages_are_stored_in_new_configuration_table_im_sr_canned_message_config_in_DB.ds"
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
