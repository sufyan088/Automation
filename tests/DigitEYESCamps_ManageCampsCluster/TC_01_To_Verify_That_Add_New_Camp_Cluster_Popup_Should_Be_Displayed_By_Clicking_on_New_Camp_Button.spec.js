const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test('TC_01_To_Verify_That_Add_New_Camp_Cluster_Popup_Should_Be_Displayed_By_Clicking_on_New_Camp_Button', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_01_To_Verify_That_Add_New_Camp_Cluster_Popup_Should_Be_Displayed_By_Clicking_on_New_Camp_Button.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster and click New Camp Cluster', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
