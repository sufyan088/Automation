const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_38_To_Verify_all_mandatory_columns_are_visible_in_Camp_Cluster_listing", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_38_To_Verify_all_mandatory_columns_are_visible_in_Camp_Cluster_listing.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Verify mandatory listing columns are visible', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectListingHeaders(page, [
      'Ref #',
      'Project Code',
      'Payer',
      'Status',
      'Camp Name',
      'Start',
      'End',
      'SF IDs',
      'Country: State',
      'Outreach Incharge',
      'Asst. Manager'
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
