const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_05_To_Verify_that_the_Sync_Data_Pending_column_shows_only_the_value_zero", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_05_To_Verify_that_the_Sync_Data_Pending_column_shows_only_the_value_zero.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify sync pending values', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.expectColumnValueOccurrenceAtLeast(page, ['Sync Data Pending', '#Sync Pending'], '0', 4);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
