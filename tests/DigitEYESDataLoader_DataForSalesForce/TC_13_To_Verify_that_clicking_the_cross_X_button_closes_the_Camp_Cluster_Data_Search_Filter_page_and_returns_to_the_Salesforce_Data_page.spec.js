const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_13_To_Verify_that_clicking_the_cross_X_button_closes_the_Camp_Cluster_Data_Search_Filter_page_and_returns_to_the_Salesforce_Data_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_13_To_Verify_that_clicking_the_cross_(X)_button_closes_the_Camp_Cluster_Data_Search_Filter_ page_and_returns_to_the_Salesforce_Data_page .ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce, open Search / Filter, close with X button and verify modal is dismissed', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.openSearchFilter(page);
    await digiteyesdataloaderDataforsalesforceHelpers.closeSearchFilterWithXButton(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
