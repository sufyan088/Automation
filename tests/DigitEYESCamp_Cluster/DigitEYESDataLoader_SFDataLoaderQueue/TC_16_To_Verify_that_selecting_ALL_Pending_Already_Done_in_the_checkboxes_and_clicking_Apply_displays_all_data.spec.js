const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test('TC_16_To_Verify_that_selecting_ALL_Pending_Already_Done_in_the_checkboxes_and_clicking_Apply_displays_all_data', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_16_To_Verify_that_selecting_ALL_Pending _Already_Done_in_the_checkboxes_and_clicking_Apply_displays_all_data.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open queue page, apply ALL filter and verify listing remains available', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderqueueHelpers.applyFilterWithDataImportedStatus(page, 'All');
    await digiteyesdataloaderSfdataloaderqueueHelpers.verifyPageLoaded(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
