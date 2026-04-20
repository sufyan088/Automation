const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_1_To_Verify_that_successful_navigation_to_SF_Data_Loader_Queue_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_1_To_Verify_that_successful_navigation_to_SF_Data_Loader_Queue_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page and verify it loads', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
