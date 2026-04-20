const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_51_To_Verify_user_can_select_different_options_from_the_Payer_dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_51_To_Verify_user_can_select_different_options_from_the_Payer_dropdown.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Open Search / Filter popup and select a payer', async () => {
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.selectSearchPayer(page, data.visionSpringPayer);
    await digiteyescampsManagecampsclusterHelpers.expectSelectedSearchPayer(page, data.visionSpringPayer);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
