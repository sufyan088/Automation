const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Alert_Message_Should_Be_Displayed_When_Participant_First_Name_Text_Field_Is_Empty", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Alert_Message_Should_Be_Displayed_When_Participant_First_Name_Text_Field_Is_Empty.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that participant first name cannot be left blank', async () => {
    await campServerIndiaRegistrationHelpers.verifyFirstNameRequired(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
