const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderParticipantconsentsHelpers
} = require('./_shared');

test("TC_4_To_Verify_that_Refresh_Button_Reloads_Latest_Pending_Consent_Records_Correctly", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/ParticipantConsents/TC_4_To_Verify_that_Refresh_Button_Reloads_Latest_Pending_Consent_Records_Correctly.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Participant Consents and refresh the page', async () => {
    await digiteyesdataloaderParticipantconsentsHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderParticipantconsentsHelpers.clickRefresh(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
