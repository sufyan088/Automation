const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_01_To_Verify_that_Data_for_Salesforce_page_loads_successfully_without_errors", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_01_To_Verify_that_Data_for_Salesforce_page_loads_successfully_without_errors.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify the expected table headers', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.expectListingHeaders(page, [
      'Ref#',
      'Project Code',
      'Camp Name',
      'Country: State',
      'Status',
      'Dated'
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
