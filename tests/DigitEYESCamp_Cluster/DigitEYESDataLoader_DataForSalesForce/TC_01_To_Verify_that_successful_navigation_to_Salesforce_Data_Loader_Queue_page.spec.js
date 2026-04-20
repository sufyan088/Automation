const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_01_To_Verify_that_successful_navigation_to_Salesforce_Data_Loader_Queue_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_01_To_Verify_that_successful_navigation_to_Salesforce_Data_Loader_Queue_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify the page loads', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
