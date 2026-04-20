const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_08_To_Verify_that_clicking_the_CSV_export_icon_downloads_the_correct_file", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_08_To_Verify_that_clicking_the_CSV_export_icon_downloads_the_correct_file.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and download the CSV export', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.downloadFirstCsv(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
