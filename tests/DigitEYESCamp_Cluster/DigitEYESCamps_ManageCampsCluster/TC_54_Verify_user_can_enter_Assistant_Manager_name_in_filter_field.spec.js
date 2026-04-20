const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_54_Verify_user_can_enter_Assistant_Manager_name_in_filter_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_54_Verify_user_can_enter_Assistant_Manager_name_in_filter_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Enter Assistant Manager name in Search / Filter popup', async () => {
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.fillSearchAssistantManager(page, 'Mammoth 2');
    await digiteyescampsManagecampsclusterHelpers.expectSearchAssistantManagerValue(page, 'Mammoth 2');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
