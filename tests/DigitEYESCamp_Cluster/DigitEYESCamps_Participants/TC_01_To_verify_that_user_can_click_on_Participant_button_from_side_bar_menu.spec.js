const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsParticipantsHelpers
} = require('./_shared');

test("TC_01_To verify_that_user_can_click_on_Participant_button_from_side_bar_menu", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/Participants/TC_01_To verify_that_user_can_click_on_Participant_button_from_side_bar_menu.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyescampsParticipantsHelpers.openModule(page, data.Country || 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
