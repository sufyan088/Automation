const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_44_To_Verify_pagination_is_enabled_for_Camp_Cluster_list_view", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_44_To_Verify_pagination_is_enabled_for_Camp_Cluster_list_view.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Verify pagination supports the expected page sizes', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectPaginationOptions(page, [
      'Show: 5',
      'Show: 50',
      'Show: 100'
    ]);
    await digiteyescampsManagecampsclusterHelpers.setListingPageSize(page, 'Show: 5');
    await digiteyescampsManagecampsclusterHelpers.setListingPageSize(page, 'Show: 100');
    await digiteyescampsManagecampsclusterHelpers.setListingPageSize(page, 'Show: 50');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
