const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_45_To_verify_that_control_should_be_toggle_switch_from_Enabled_to_Disabled", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_New_Module/TS_45_To_verify_that_control_should_be_toggle_switch_from_Enabled_to_Disabled.ds"
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
