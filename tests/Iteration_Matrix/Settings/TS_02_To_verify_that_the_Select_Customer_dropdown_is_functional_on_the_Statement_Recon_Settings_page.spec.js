const { test, loadRuntimeData, loginAsAdmin, closeSession, settingsHelpers } = require('./_shared');

test("TS_02_To_verify_that_the_Select_Customer_dropdown_is_functional_on_the_Statement_Recon_Settings_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Settings/TS_02_To_verify_that_the_Select_Customer_dropdown_is_functional_on_the_Statement_Recon_Settings_page.ds"
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
