const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_14_To_Verify_that_all_filter_fields_are_displayed_correctly_in_Search_Filter_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_14_To_Verify_that_all_filter_fields_are_displayed_correctly_in_Search_Filter_popup.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify the search filter fields', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.openSearchFilter(page);
    await digiteyesdataloaderDataforsalesforceHelpers.verifySearchFilterFields(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
