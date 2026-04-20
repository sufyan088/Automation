const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers
} = require('./_shared');

test("TC_52_To_Verify_that_user_can_select_a_project_code_from_Project_Code_dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_52_To_Verify_that_user_can_select_a_project_code_from_Project_Code_dropdown.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster landing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
  });

  await test.step('Open Search / Filter popup and verify the project code dropdown', async () => {
    await digiteyescampsManagecampsclusterHelpers.openSearchFilter(page);
    await digiteyescampsManagecampsclusterHelpers.selectSearchPayer(page, data.visionSpringPayer);
    await digiteyescampsManagecampsclusterHelpers.expectSearchProjectCodeOption(page, data.visionSpringProjectCode);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
