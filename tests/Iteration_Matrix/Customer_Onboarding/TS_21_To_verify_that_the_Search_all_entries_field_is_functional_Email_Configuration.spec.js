const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingHelpers } = require('./_shared');

test("TS_21_To_verify_that_the_Search_all_entries_field_is_functional_Email_Configuration", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_21_To_verify_that_the_Search_all_entries_field_is_functional_Email_Configuration.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await customerOnboardingHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
