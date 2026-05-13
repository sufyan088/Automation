const { test, loadRuntimeData, loginAsAdmin, closeSession, duplicateDashboardNewModuleHelpers } = require('./_shared');

test("TS_67_To_verify_when_configuration_has_already_done_it_shows_message_settings_already_configured", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Duplicate_Dashboard_New_Module/TS_67_To_verify_when_configuration_has_already_done_it_shows_message_settings_already_configured.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await duplicateDashboardNewModuleHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

