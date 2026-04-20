const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_7_To_Verify_that_the_#Sync_Pending_column_displays_only_zero_(0)_value", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_7_To_Verify_that_the_#Sync_Pending_column_displays_only_zero_(0)_value.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page and verify sync pending values are zero', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.expectColumnValueOccurrenceAtLeast(page, ['#Sync Pending', 'Sync Pending'], '0', 3);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
