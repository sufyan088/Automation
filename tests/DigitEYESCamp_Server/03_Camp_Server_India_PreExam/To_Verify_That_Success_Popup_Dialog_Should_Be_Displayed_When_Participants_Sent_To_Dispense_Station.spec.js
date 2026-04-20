const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaPreexamHelpers
} = require('./_shared');

test("To_Verify_That_Success_Popup_Dialog_Should_Be_Displayed_When_Participants_Sent_To_Dispense_Station", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/PreExam/To_Verify_That_Success_Popup_Dialog_Should_Be_Displayed_When_Participants_Sent_To_Dispense_Station.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaPreexamHelpers.verifySuccessPopupForDispense(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
