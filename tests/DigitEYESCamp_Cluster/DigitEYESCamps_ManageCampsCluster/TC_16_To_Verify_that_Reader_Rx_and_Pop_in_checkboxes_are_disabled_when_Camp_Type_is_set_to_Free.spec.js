const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_16_To_Verify_that_Reader_Rx_and_Pop_in_checkboxes_are_disabled_when_Camp_Type_is_set_to_Free", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_16_To_Verify_that_Reader_Rx_and_Pop_in_checkboxes_are_disabled_when_Camp_Type_is_set_to_Free.ds"
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

  await test.step('Select Free camp type and verify contribution checkboxes are disabled', async () => {
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campTypeField,
      'Free',
      'Camp Type'
    );

    await digiteyescampsManagecampsclusterHelpers.expectFieldDisabledState(
      page,
      digiteyescampsManagecampsclusterSelectors.contributionReaderCheckbox,
      true,
      'Reader checkbox'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldDisabledState(
      page,
      digiteyescampsManagecampsclusterSelectors.contributionRxCheckbox,
      true,
      'Rx checkbox'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldDisabledState(
      page,
      digiteyescampsManagecampsclusterSelectors.contributionPopinCheckbox,
      true,
      'Popin checkbox'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
