const { test, loadRuntimeData, loginAsAdmin, closeSession, settingsHelpers } = require('./_shared');

test("TS_05_To_verify_that_the_Character_Limit_for_Invoice_Statements_setting_is_working_properly_on_the_statement_recon_settings_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Settings/TS_05_To_verify_that_the_Character_Limit_for_Invoice_Statements_setting_is_working_properly_on_the_statement_recon_settings_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await settingsHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
