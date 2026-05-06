const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingHelpers } = require('./_shared');

test("TS_17_To_verify_on_the_Update_Participant_popup_the_save_button_is_functional_on_the_Participant_Register_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_17_To_verify_on_the_Update_Participant_popup_the_save_button_is_functional_on_the_Participant_Register_page.ds"
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
