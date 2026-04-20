const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaRegistrationHelpers
} = require('./_shared');

test("To_Verify_That_Participants_Page_Should_Be_Redirected_When_Participants_List_Button_Is_Clicked", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Registration/To_Verify_That_Participants_Page_Should_Be_Redirected_When_Participants_List_Button_Is_Clicked.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify that Participants List redirects the user to the Participants page', async () => {
    await campServerIndiaRegistrationHelpers.verifyParticipantsPageRedirect(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
