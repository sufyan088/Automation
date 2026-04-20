const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Success_Pop_Dialog_Message_Should_Be_Displayed_When_Participants_Is_Successfully_Registered", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Success_Pop_Dialog_Message_Should_Be_Displayed_When_Participants_Is_Successfully_Registered.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaRegistrationHelpers.verifySuccessPopupMessage(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
