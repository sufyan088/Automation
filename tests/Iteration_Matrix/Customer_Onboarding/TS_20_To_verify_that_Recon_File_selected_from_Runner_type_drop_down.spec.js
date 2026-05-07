const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingHelpers } = require('./_shared');

test("TS_20_To_verify_that_Recon_File_selected_from_Runner_type_drop_down", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_20_To_verify_that_Recon_File_selected_from_Runner_type_drop_down.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await customerOnboardingHelpers.runScenario(page, data, test.info().title);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
