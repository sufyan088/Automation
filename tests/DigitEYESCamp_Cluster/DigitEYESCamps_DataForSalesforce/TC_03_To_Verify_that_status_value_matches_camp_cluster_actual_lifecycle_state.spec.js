const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_03_To_Verify_that_status_value_matches_camp_cluster_actual_lifecycle_state", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_03_To_Verify_that_status_value_matches_camp_cluster_actual_lifecycle_state.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify the status values use valid lifecycle states', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.expectStatusesWithinAllowed(page, [
      'New / Open',
      'Running',
      'Closed'
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
