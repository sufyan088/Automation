const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_20_To_Verify_that_Mobile_No_Prefix_field_accepts_valid_input", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_20_To_Verify_that_Mobile_No_Prefix_field_accepts_valid_input.ds"
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

  await test.step('Enter a Mobile No Prefix value', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.mobilePrefixField,
      '7',
      'Mobile No Prefix'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.mobilePrefixField,
      '7',
      'Mobile No Prefix'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
