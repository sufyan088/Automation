const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_23_To_Verify_that_Queue_page_loads_within_acceptable_performance_time", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_23_To_Verify_that_Queue_page_loads_within_acceptable_performance_time.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page within the expected time budget', async () => {
    const durationMs = await digiteyesdataloaderSfdataloaderqueueHelpers.measureOpenModuleDuration(page, data.Country || data.visionSpringCountry || 'India');
    expect(durationMs, 'Queue page should load within 30 seconds').toBeLessThan(30000);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
