const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_5_To_Verify_that_all_campaign_statuses_are_displayed_as_Closed_in_the_Status_column", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_5_To_Verify_that_all_campaign_statuses_are_displayed_as_Closed_in_the_Status_column.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page and verify statuses are closed', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.expectColumnValueOccurrenceAtLeast(page, 'Status', 'Closed', 3);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
