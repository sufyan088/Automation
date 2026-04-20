const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_14_To_Verify_validation_message_is_displayed_when_IP_Name_is_not_selected_for_Implementation_Partner", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_14_To_Verify_validation_message_is_displayed_when_IP_Name_is_not_selected_for_Implementation_Partner.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Fill mandatory details except IP Name and save', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillCreateCampClusterForm(page, data);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campThemeField,
      'School Screening',
      'Camp Theme'
    );
    await digiteyescampsManagecampsclusterHelpers.fillAddressInformation(page, {
      country: data.visionSpringCountry
    });
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.startDateField,
      '2026-02-09',
      'Start Date'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      '2026-02-10',
      'End Date'
    );
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.conductedByField,
      'Implementation Partner',
      'Conducted By'
    );
    await digiteyescampsManagecampsclusterHelpers.clickSave(page);
  });

  await test.step('Verify IP Name shows validation failure', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectFieldValidationFailure(
      page,
      digiteyescampsManagecampsclusterSelectors.ipNameField,
      'IP Name'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
