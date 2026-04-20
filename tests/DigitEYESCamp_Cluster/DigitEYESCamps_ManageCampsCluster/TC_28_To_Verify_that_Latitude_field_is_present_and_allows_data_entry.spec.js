const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_28_To_Verify_that_Latitude_field_is_present_and_allows_data_entry", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_28_To_Verify_that_Latitude_field_is_present_and_allows_data_entry.ds"
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

  await test.step('Enter a Latitude value', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.latitudeField,
      '12.9716',
      'Latitude'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.latitudeField,
      '12.9716',
      'Latitude'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
