const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_02_Verify_that_eleven_columns_are_displayed_in_the_table_header_on_the_Salesforce_Data_Loader_Queue_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_02_Verify_that_eleven_columns_are_displayed_in_the_table_header_on_the_Salesforce_Data_Loader_Queue_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify all listing table column headers', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.expectListingHeaders(page, [
      'Ref#',
      'Project Code',
      'Camp Name',
      'Location',
      ['Country: State', 'Country'],
      'Status',
      'Picked By',
      ['#Regs.', '#Regs', 'Regs'],
      ['#Sync DataPending', 'Sync Data Pending', 'Sync'],
      'Dated'
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
