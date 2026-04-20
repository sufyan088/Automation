const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test('TC_57_To_Verify_that_camp_cluster_records_are_filtered_correctly_when_only_New_Open_status_checkbox_is_selected', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_57_To_Verify_that_camp_cluster_records_are_filtered_correctly_when_only_New_Open_status_checkbox_is_selected.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster and Search Filter', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
  });

  await test.step('Keep New/Open status and uncheck Running status', async () => {
    await digiteyescampsManagecampsclusterHelpers.setSearchStatusCheckbox(page, 'running', false);
    await digiteyescampsManagecampsclusterHelpers.expectSearchStatusCheckboxState(page, 'running', false);
  });

  await test.step('Apply filter and verify New status appears in listing', async () => {
    await digiteyescampsManagecampsclusterHelpers.applySearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.expectListingContainsStatus(page, 'New');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
