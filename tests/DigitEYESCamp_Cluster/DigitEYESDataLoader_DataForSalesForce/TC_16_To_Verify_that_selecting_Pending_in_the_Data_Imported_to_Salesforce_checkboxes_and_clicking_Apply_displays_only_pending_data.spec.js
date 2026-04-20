const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_16_To_Verify_that_selecting_Pending_in_the_Data_Imported_to_Salesforce_checkboxes_and_clicking_Apply_displays_only_pending_data", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_16_To_Verify_that_selecting_Pending_in_the_Data_Imported_to_Salesforce_checkboxes_and_clicking_Apply_displays_only_pending_data.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce, open Search / Filter, apply with Pending status and verify listing returns', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.openSearchFilter(page);
    await digiteyesdataloaderDataforsalesforceHelpers.applyFilterWithDataImportedStatus(page, 'Pending');
    await digiteyesdataloaderDataforsalesforceHelpers.verifyPageLoaded(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
