const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_05_To_Verify_that_the_user_can_select_a_value_from_the_Camp_Theme_dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_05_To_Verify_that_the_user_can_select_a_value_from_the_Camp_Theme_dropdown.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Verify Camp Theme dropdown contains expected values', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectDropdownOptions(
      page,
      digiteyescampsManagecampsclusterSelectors.campThemeField,
      ['S2E', 'S2L', 'S2S'],
      'Camp Theme'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
