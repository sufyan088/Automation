const { test, loadRuntimeData, loginAsAdmin, closeSession } = require('./_shared');

test("TS_07_To_verify_that_the_PO_Match_setting_is_working_properly_on_the_statement_recon_settings_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Settings/TS_07_To_verify_that_the_PO_Match_setting_is_working_properly_on_the_statement_recon_settings_page.ds"
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
