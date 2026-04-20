const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_25_Verify_that_the_Yes_and_No_options_are_present_in_the_2nd_Glasses_dropdown", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_25_Verify_that_the_Yes_and_No_options_are_present_in_the_2nd_Glasses_dropdown.ds"
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

  await test.step('Verify the 2nd Glasses dropdown supports Yes and No', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectDropdownOptions(
      page,
      digiteyescampsManagecampsclusterSelectors.secondGlassField,
      ['Yes', 'No'],
      '2nd Glasses'
    );
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.secondGlassField,
      'Yes',
      '2nd Glasses'
    );
    await digiteyescampsManagecampsclusterHelpers.expectSelectedOption(
      page,
      digiteyescampsManagecampsclusterSelectors.secondGlassField,
      'Yes',
      '2nd Glasses'
    );
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.secondGlassField,
      'No',
      '2nd Glasses'
    );
    await digiteyescampsManagecampsclusterHelpers.expectSelectedOption(
      page,
      digiteyescampsManagecampsclusterSelectors.secondGlassField,
      'No',
      '2nd Glasses'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
