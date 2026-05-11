const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingHelpers } = require('./_shared');

test("TS_06_To_verify_that_Next_button_is_functional", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_06_To_verify_that_Next_button_is_functional.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await customerOnboardingHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
