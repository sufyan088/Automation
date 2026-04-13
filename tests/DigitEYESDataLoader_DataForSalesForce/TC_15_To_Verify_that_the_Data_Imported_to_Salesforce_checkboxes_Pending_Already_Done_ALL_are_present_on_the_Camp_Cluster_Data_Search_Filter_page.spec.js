const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_15_To_Verify_that_the_Data_Imported_to_Salesforce_checkboxes_Pending_Already_Done_ALL_are_present_on_the_Camp_Cluster_Data_Search_Filter_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_15_To_Verify_that_the_Data_Imported_to_Salesforce_checkboxes_ Pending_Already_Done_ALL_are_present_on_the_Camp_Cluster_Data_Search_Filter_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce, open Search / Filter and verify Pending, Already Done and ALL radio buttons are present', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.openSearchFilter(page);
    await digiteyesdataloaderDataforsalesforceHelpers.verifyDataImportedCheckboxesPresent(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
