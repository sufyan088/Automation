const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test('TC_15_To_Verify_that_selecting_Already_Done_in_the_Data_Imported_to_Salesforce_checkboxes_and_clicking_Apply_displays_only_completed_data', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_15_To_Verify_that_selecting_Alread_Done_in_the_Data_Imported_to_Salesforce_checkboxes_and_clicking _Apply_displays_only_completed_data.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open queue page, apply Already Done filter and verify listing remains available', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderqueueHelpers.applyFilterWithDataImportedStatus(page, 'Marked');
    await digiteyesdataloaderSfdataloaderqueueHelpers.verifyPageLoaded(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
