const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Occupation_Vs_Registrations_Graphic_Data_Of_Participants_Should_Be_Displayed_On_Dashboard_When_User_Registered_The_Participants", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Occupation_Vs_Registrations_Graphic_Data_Of_Participants_Should_Be_Displayed_On_Dashboard_When_User_Registered_The_Participants.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that the Occupation vs Registrations chart is displayed on Dashboard after participant registration', async () => {
    await campServerIndiaRegistrationHelpers.verifyOccupationVsRegistrationsChart(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
