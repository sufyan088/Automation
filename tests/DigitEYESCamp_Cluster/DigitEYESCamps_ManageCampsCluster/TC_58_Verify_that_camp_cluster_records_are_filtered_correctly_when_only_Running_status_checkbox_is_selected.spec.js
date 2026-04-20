const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test('TC_58_Verify_that_camp_cluster_records_are_filtered_correctly_when_only_Running_status_checkbox_is_selected', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_58_Verify_that_camp_cluster_records_are_filtered_correctly_when_only_Running_status_checkbox_is_selected.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster and Search Filter', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
  });

  await test.step('Uncheck New/Open status and keep Running status selected', async () => {
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'newOpen', false);
    await digiteyescampsManagecampsclusterHelpers.expectSearchStatusCheckboxState(page, 'newOpen', false);
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'running', true);
  });

  await test.step('Apply filter and verify Run status appears in listing', async () => {
    await digiteyescampsManagecampsclusterHelpers.applySearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.expectListingContainsStatus(page, 'Run');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
