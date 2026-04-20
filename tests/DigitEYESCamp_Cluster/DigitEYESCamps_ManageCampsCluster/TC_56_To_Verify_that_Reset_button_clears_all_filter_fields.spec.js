const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_56_To_Verify_that_Reset_button_clears_all_filter_fields", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_56_To_Verify_that_Reset_button_clears_all_filter_fields.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Reset Search / Filter values after entering Assistant Manager', async () => {
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.fillSearchAssistantManager(page, 'Mammoth 2');
    await digiteyescampsManagecampsclusterHelpers.expectSearchAssistantManagerValue(page, 'Mammoth 2');
    await digiteyescampsManagecampsclusterHelpers.resetSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.expectSearchAssistantManagerValue(page, '');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
