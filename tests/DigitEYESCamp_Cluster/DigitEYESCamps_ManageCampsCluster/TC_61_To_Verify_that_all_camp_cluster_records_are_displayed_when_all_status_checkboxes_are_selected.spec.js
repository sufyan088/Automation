const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test('TC_61_To_Verify_that_all_camp_cluster_records_are_displayed_when_all_status_checkboxes_are_selected', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_61_To_Verify_that_all_camp_cluster_records_are_displayed_when_all_status_checkboxes_are_selected.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster and Search Filter', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
  });

  await test.step('Select all status checkboxes', async () => {
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'newOpen', true);
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'running', true);
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'closed', true);
  });

  await test.step('Apply filter and verify camp cluster records are visible', async () => {
    await digiteyescampsManagecampsclusterHelpers.applySearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.expectListingTableHasRows(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
