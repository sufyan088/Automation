const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_64_To_verify_that_configured_predefined_message_showed_as_hover_over_help_tool_tip_next_to_match_status_in_SR_result_screen", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/SR_Search_New_Module/TS_64_To_verify_that_configured_predefined_message_showed_as_hover_over_help_tool_tip_next_to_match_status_in_SR_result_screen.ds"
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
