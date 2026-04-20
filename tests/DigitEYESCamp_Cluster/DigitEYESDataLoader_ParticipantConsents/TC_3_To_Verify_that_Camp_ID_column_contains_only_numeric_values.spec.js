const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderParticipantconsentsHelpers
} = require('./_shared');

test("TC_3_To_Verify_that_Camp_ID_column_contains_only_numeric_values", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/ParticipantConsents/TC_3_To_Verify_that_Camp_ID_column_contains_only_numeric_values.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Participant Consents and verify camp ids are numeric', async () => {
    await digiteyesdataloaderParticipantconsentsHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderParticipantconsentsHelpers.expectColumnValuesNumeric(page, 'Camp ID');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
