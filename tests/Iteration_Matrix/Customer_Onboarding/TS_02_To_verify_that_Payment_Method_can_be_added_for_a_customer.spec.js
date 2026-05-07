const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingHelpers } = require('./_shared');

test("TS_02_To_verify_that_Payment_Method_can_be_added_for_a_customer", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding/TS_02_To_verify_that_Payment_Method_can_be_added_for_a_customer.ds"
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
