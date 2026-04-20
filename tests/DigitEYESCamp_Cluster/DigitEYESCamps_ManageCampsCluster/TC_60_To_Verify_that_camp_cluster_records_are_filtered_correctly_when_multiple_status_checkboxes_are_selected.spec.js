const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test('TC_60_To_Verify_that_camp_cluster_records_are_filtered_correctly_when_multiple_status_checkboxes_are_selected', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_60_To_Verify_that_camp_cluster_records_are_filtered_correctly_when_multiple_status_checkboxes_are_selected.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster and Search Filter', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
  });

  await test.step('Keep multiple status checkboxes selected', async () => {
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'newOpen', true);
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'running', true);
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'closed', false);
  });

  await test.step('Apply filter and verify listing is filtered by selected statuses', async () => {
    await digiteyescampsManagecampsclusterHelpers.applySearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.expectListingStatusesWithinAllowed(page, ['New', 'Run', 'Running', 'Open']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
