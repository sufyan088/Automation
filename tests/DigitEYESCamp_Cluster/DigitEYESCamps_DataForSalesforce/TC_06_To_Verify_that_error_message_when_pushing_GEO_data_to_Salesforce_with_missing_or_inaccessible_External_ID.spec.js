const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test('TC_06_To_Verify_that_error_message_when_pushing_GEO_data_to_Salesforce_with_missing_or_inaccessible_External_ID', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_06_To_Verify_that_error_message_when_pushing_GEO_data_to_Salesforce_with_missing_or_inaccessible_External_ID.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and click Push GEO to Salesforce', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry || data.Country || 'India');
    await digiteyescampsDataforsalesforceHelpers.clickPushGeoToSalesforce(page);
    await digiteyescampsDataforsalesforceHelpers.verifyPageLoaded(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
