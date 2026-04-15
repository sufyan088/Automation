const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Alert_Message_Should_Be_Displayed_By_Entering_Invalid_Driving_License_Number", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Alert_Message_Should_Be_Displayed_By_Entering_Invalid_Driving_License_Number.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that alert message is displayed by entering invalid Driving License number', async () => {
    await campServerIndiaRegistrationHelpers.verifyInvalidDrivingLicense(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
