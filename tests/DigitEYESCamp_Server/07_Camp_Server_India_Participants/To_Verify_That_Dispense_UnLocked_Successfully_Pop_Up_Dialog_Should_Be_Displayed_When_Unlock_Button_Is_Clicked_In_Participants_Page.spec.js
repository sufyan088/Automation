const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession
} = require('./_shared');

test("To_Verify_That_Dispense_UnLocked_Successfully_Pop_Up_Dialog_Should_Be_Displayed_When_Unlock_Button_Is_Clicked_In_Participants_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq2/Test Scripts/Camp Server/Camp_Server_India/Participants/To_Verify_That_Dispense_UnLocked_Successfully_Pop_Up_Dialog_Should_Be_Displayed_When_Unlock_Button_Is_Clicked_In_Participants_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Run converted flow', async () => {
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
