const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_11_To_Verify_that_clicking_the_Refresh _button_reloads_the_ page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_11_To_Verify_that_clicking_the_Refresh _button_reloads_the_ page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and refresh the listing', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.clickRefresh(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
