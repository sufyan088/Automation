const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_17_To_Verify_that_Reader_Rx_and_Popin_checkboxes_are_enabled_when_Camp_Type_is_set_to_Contribution", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_17_To_Verify_that_Reader_Rx_and_Popin_checkboxes_are_enabled_when_Camp_Type_is_set_to_Contribution.ds"
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

  await test.step('Select Contribution camp type and verify contribution checkboxes are enabled', async () => {
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campTypeField,
      'Contribution',
      'Camp Type'
    );

    await digiteyescampsManagecampsclusterHelpers.expectFieldDisabledState(
      page,
      digiteyescampsManagecampsclusterSelectors.contributionReaderCheckbox,
      false,
      'Reader checkbox'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldDisabledState(
      page,
      digiteyescampsManagecampsclusterSelectors.contributionRxCheckbox,
      false,
      'Rx checkbox'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldDisabledState(
      page,
      digiteyescampsManagecampsclusterSelectors.contributionPopinCheckbox,
      false,
      'Popin checkbox'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
