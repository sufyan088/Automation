const { test } = require('@playwright/test');
const { expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_46_To_Verify_that_Refresh_button_reloads_camp_cluster_listing", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_46_To_Verify_that_Refresh_button_reloads_camp_cluster_listing.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Refresh the listing and verify rows remain available', async () => {
    const beforeRefreshCount = await digiteyescampsManagecampsclusterHelpers.getListingRowCount(page);
    await digiteyescampsManagecampsclusterHelpers.refreshListing(page);
    const afterRefreshCount = await digiteyescampsManagecampsclusterHelpers.getListingRowCount(page);
    expect(afterRefreshCount).toBeGreaterThan(0);
    expect(afterRefreshCount).toBe(beforeRefreshCount);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
