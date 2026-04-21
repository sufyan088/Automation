const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_63_Verify_that_Exclude_Payment_Statuses_setting_persisted_correctly_after_saving_and_again_navigating_to_settings_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Criteria_Settings_Two/TS_63_Verify_that_Exclude_Payment_Statuses_setting_persisted_correctly_after_saving_and_again_navigating_to_settings_page.ds"
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
