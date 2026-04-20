const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_37_To_Verify_that_camp_cluster_records_are_displayed_in_proper_tabular_format", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_37_To_Verify_that_camp_cluster_records_are_displayed_in_proper_tabular_format.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Verify camp cluster records are displayed in tabular format', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectListingTableHasRows(page);
    await digiteyescampsManagecampsclusterHelpers.expectListingHeaders(page, ['Ref #', 'Project Code', 'Payer']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
