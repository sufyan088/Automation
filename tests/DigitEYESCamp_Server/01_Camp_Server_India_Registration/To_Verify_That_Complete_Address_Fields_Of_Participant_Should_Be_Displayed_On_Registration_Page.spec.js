const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Complete_Address_Fields_Of_Participant_Should_Be_Displayed_On_Registration_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Complete_Address_Fields_Of_Participant_Should_Be_Displayed_On_Registration_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that complete address fields of participant are displayed on Registration page', async () => {
    await campServerIndiaRegistrationHelpers.verifyCompleteAddressFields(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
