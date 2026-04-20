const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_22_verify_that_Vision_Chart_dropdown_allows_user_to_select_three_different_chart_types", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_22_verify_that_Vision_Chart_dropdown_allows_user_to_select_three_different_chart_types.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      data.visionSpringCountry,
      'Country'
    );
  });

  await test.step('Verify Vision Chart dropdown contains the expected chart types', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectDropdownOptions(
      page,
      digiteyescampsManagecampsclusterSelectors.visionChartField,
      ['LogMAR', 'Snellen - Imperial e.g 20/20', 'Snellen - Metric e.g 6/6'],
      'Vision Chart'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
