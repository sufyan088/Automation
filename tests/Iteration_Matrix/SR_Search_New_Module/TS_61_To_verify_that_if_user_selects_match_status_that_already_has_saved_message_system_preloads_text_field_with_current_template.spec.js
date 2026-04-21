const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_61_To_verify_that_if_user_selects_match_status_that_already_has_saved_message_system_preloads_text_field_with_current_template", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_61_To_verify_that_if_user_selects_match_status_that_already_has_saved_message_system_preloads_text_field_with_current_template.ds"
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
