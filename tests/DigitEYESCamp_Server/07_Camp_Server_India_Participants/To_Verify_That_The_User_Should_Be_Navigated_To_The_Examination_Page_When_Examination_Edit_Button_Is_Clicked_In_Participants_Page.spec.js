const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  campServerIndiaParticipantsHelpers
} = require('./_shared');

test("To_Verify_That_The_User_Should_Be_Navigated_To_The_Examination_Page_When_Examination_Edit_Button_Is_Clicked_In_Participants_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Participants/To_Verify_That_The_User_Should_Be_Navigated_To_The_Examination_Page_When_Examination_Edit_Button_Is_Clicked_In_Participants_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
    await campServerIndiaParticipantsHelpers.verifyNavigateToExaminationPage(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
