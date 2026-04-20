const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderParticipantconsentsHelpers
} = require('./_shared');

test('TC_2_To_Verify_that_5_columns_are_displayed_on_the_Consent_on_SharePoint_Pending_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/ParticipantConsents/TC_2_To_Verify_that _5_columns_are_displayed _on_the_Consent_on_SharePoint_Pending_page .ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Participant Consents and verify expected columns are displayed', async () => {
    await digiteyesdataloaderParticipantconsentsHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderParticipantconsentsHelpers.expectListingHeaders(page, [
      'Camp ID',
      ['Country: State', 'Country'],
      'Participant ID',
      'Participant Name',
      ['Sharepoint Status', 'SharePoint Status']
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
