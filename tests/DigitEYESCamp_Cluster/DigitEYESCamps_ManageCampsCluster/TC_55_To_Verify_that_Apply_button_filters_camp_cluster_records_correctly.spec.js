const { test } = require('@playwright/test');
const { expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_55_To_Verify_that_Apply_button_filters_camp_cluster_records_correctly", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_55_To_Verify_that_Apply_button_filters_camp_cluster_records_correctly.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Apply Search / Filter using Assistant Manager', async () => {
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.fillSearchAssistantManager(page, 'Mammoth 2');
    await digiteyescampsManagecampsclusterHelpers.expectSearchAssistantManagerValue(page, 'Mammoth 2');
    const beforeApplyCount = await digiteyescampsManagecampsclusterHelpers.getListingRowCount(page);
    await digiteyescampsManagecampsclusterHelpers.applySearchFilter(page);
    const afterApplyCount = await digiteyescampsManagecampsclusterHelpers.getListingRowCount(page);
    expect(afterApplyCount).toBeGreaterThan(0);
    expect(afterApplyCount).toBeLessThanOrEqual(beforeApplyCount);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
