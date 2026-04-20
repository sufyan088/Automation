const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test("TC_1_To_Verify_that_Navigation_to_Salesforce_Data_Loader_Error_Cases_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_1_To_Verify_that_Navigation_to_Salesforce_Data_Loader_Error_Cases_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and verify the page loads', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
