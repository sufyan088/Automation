const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_ID_Proof_Value_Text_Field_Should_Not_Be_Left_Blank_While_Registering_Participant", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_ID_Proof_Value_Text_Field_Should_Not_Be_Left_Blank_While_Registering_Participant.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that Postal Code cannot be left blank on the Address step during Registration', async () => {
    await campServerIndiaRegistrationHelpers.verifyPostalCodeRequired(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
