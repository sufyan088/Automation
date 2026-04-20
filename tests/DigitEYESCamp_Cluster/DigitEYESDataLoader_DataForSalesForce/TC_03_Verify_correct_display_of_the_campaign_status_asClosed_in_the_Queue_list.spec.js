const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_03_Verify_correct_display_of_the_campaign_status_asClosed_in_the_Queue_list", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_03_Verify_correct_display_of_the_campaign_status_asClosed_in_the_Queue_list.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify closed statuses', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.expectColumnValueOccurrenceAtLeast(page, 'Status', 'Closed', 1);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
