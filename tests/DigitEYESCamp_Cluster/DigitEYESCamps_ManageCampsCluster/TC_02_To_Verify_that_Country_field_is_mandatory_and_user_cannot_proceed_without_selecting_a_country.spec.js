const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_02_To_Verify_that_Country_field_is_mandatory_and_user_cannot_proceed_without_selecting_a_country', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_02_To_Verify_that_Country_field_is_mandatory_and_user_cannot_proceed_without_selecting_a_country.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form and attempt Save without country', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.clickSave(page);
  });

  await test.step('Verify Country field validation is shown', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectFieldValidationFailure(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      'Country'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
