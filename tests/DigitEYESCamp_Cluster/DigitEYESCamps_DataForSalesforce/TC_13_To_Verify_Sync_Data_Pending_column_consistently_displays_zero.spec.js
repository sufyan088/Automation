const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_13_To_Verify _Sync_Data_Pending_column_consistently_displays_zero", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_13_To_Verify _Sync_Data_Pending_column_consistently_displays_zero.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify Sync Data Pending is zero', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.expectListingHeaders(page, [['#Sync DataPending', 'Sync Data Pending']]);
    await digiteyescampsDataforsalesforceHelpers.expectColumnValueOccurrenceAtLeast(page, ['#Sync DataPending', 'Sync Data Pending'], '0', 1);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
