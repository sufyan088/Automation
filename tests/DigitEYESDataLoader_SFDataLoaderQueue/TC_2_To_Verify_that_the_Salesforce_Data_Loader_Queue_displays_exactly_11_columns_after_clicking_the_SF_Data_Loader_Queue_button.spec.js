const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test('TC_2_To_Verify_that_the_Salesforce_Data_Loader_Queue_displays_exactly_11_columns_after_clicking_the_SF_Data_Loader_Queue_button', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_2_To_Verify_that_the_Salesforce_Data_Loader_Queue_displays_exactly_11_columns_after_clicking_the_SF_Data_Loader_Queue_button.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open queue page and verify expected listing table columns', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.expectListingHeaders(page, [
      'Ref#',
      'Camp Date',
      'Camp Name',
      'Location',
      ['Country: State', 'Country'],
      'Status',
      ['#Regs.', '#Regs', 'Regs'],
      ['#Sync Pending', 'Sync Pending'],
      ['#Screened', 'Screened'],
      ['Sign Sync', 'Sync']
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
