const { test, loadRuntimeData, loginAsAdmin, closeSession, customerOnboardingImremitLiteHelpers } = require('./_shared');

test("TS_01_Verify_That_A_New_Customer_Can_Be_Added_In_Customer_Management_Tab_In_Admin_Module_imREmit_Lite", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/Test Scripts/Customer_Onboarding_imREmit_Lite/TS_01_Verify_That_A_New_Customer_Can_Be_Added_In_Customer_Management_Tab_In_Admin_Module_imREmit_Lite.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await customerOnboardingImremitLiteHelpers.runScenario(page, data, test.info().title);

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
