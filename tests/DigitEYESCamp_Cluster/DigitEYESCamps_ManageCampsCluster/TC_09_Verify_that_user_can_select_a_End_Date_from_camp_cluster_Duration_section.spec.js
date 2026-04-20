const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_09_Verify_that_user_can_select_a_End_Date_from_camp_cluster_Duration_section", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_09_Verify_that_user_can_select_a_End_Date_from_camp_cluster_Duration_section.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Enter an End Date in the duration section', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      '2026-02-09',
      'End Date'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      '2026-02-09',
      'End Date'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
