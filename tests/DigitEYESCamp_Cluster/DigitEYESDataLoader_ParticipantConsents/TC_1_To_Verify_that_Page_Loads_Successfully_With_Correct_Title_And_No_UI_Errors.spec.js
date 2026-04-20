const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderParticipantconsentsHelpers
} = require('./_shared');

test("TC_1_To_Verify_that_Page_Loads_Successfully_With_Correct_Title_And_No_UI_Errors", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/ParticipantConsents/TC_1_To_Verify_that_Page_Loads_Successfully_With_Correct_Title_And_No_UI_Errors.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Participant Consents and verify the page loads', async () => {
    await digiteyesdataloaderParticipantconsentsHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
