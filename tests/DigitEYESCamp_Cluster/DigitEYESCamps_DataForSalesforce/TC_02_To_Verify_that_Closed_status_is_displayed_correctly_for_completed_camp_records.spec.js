const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_02_To_Verify_that_Closed_status_is_displayed_correctly_for_completed_camp_records", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_02_To_Verify_that_Closed_status_is_displayed_correctly_for_completed_camp_records.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify closed camp records are visible', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.expectListingHeaders(page, ['Status']);
    await digiteyescampsDataforsalesforceHelpers.expectColumnContainsValue(page, 'Status', 'Closed');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
