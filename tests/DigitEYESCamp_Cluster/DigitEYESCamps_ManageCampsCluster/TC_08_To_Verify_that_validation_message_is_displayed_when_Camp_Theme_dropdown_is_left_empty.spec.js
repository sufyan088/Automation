const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_08_To_Verify_that_validation_message_is_displayed_when_Camp_Theme_dropdown_is_left_empty", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_08_To_Verify_that_validation_message_is_displayed_when_Camp_Theme_dropdown_is_left_empty.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Leave Camp Theme blank and attempt to save', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillCreateCampClusterForm(page, data);
    await digiteyescampsManagecampsclusterHelpers.clickSave(page);
    await digiteyescampsManagecampsclusterHelpers.expectFieldValidationFailure(
      page,
      digiteyescampsManagecampsclusterSelectors.campThemeField,
      'Camp Theme'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
