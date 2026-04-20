const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_15_Verify_that_Camp_Type_dropdown_displays_Free_and_Contribution_options", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_15_Verify_that_Camp_Type_dropdown_displays_Free_and_Contribution_options.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Verify Camp Type dropdown contains Free and Contribution', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectDropdownOptions(
      page,
      digiteyescampsManagecampsclusterSelectors.campTypeField,
      ['Free', 'Contribution'],
      'Camp Type'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
