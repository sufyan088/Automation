const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Participant_Should_Be_Registered_Without_Aadhaar_No_And_No_ID_Available", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Participant_Should_Be_Registered_Without_Aadhaar_No_And_No_ID_Available.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that participant can be registered without Aadhaar number and without any ID proof', async () => {
    await campServerIndiaRegistrationHelpers.verifyRegistrationWithoutAadhaarAndNoId(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
