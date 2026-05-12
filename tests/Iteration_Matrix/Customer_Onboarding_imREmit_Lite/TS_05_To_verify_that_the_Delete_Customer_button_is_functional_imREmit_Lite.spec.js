const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingImremitLiteHelpers } = require('./_shared');

test("TS_05_To_verify_that_the_Delete_Customer_button_is_functional_imREmit_Lite", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding_imREmit_Lite/TS_05_To_verify_that_the_Delete_Customer_button_is_functional_imREmit_Lite.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await customerOnboardingImremitLiteHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
