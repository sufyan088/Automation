const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_17_To_Verify_that_selecting_Already_Done_in_the_Data_Imported_to_Salesforce_checkboxes_and_clicking_Apply_displays_only_completed_data", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_17_To_Verify_that_selecting_Already_Done_in_the_Data_Imported_to_Salesforce_checkboxes_and_clicking_Apply_displays_only_completed_data.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce, open Search / Filter, select Already Done and apply, verify listing returns', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.openSearchFilter(page);
    await digiteyesdataloaderDataforsalesforceHelpers.applyFilterWithDataImportedStatus(page, 'Marked');
    await digiteyesdataloaderDataforsalesforceHelpers.verifyPageLoaded(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
