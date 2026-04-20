const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_08_To_Verify_that_Mark_Data_Imported_to_Salesforce_updates_camp_status", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_08_To_Verify_that_Mark_Data_Imported_to_Salesforce_updates_camp_status.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and mark the first available row as imported', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.markFirstRowDataImported(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
