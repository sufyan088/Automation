const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_10_To_Verify_CSV_export_downloads_correct_Camp_data_on_clicking_the_CSV_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_10_To_Verify_CSV_export_downloads_correct_Camp_data_on_clicking_the_CSV_button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and download the CSV export', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.downloadFirstCsv(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
