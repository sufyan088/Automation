const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Consent_Form_Buttons_Should_Be_Displayed_On_Consent_Form_When_Registration_Button_Is_Clicked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Consent_Form_Buttons_Should_Be_Displayed_On_Consent_Form_When_Registration_Button_Is_Clicked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that consent form buttons are displayed on the consent form when Registration button is clicked', async () => {
    await campServerIndiaRegistrationHelpers.verifyConsentFormButtons(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
