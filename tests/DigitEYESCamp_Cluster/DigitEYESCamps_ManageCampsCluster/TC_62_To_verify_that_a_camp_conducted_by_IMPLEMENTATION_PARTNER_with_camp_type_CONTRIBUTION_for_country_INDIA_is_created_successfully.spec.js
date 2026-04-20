const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_62_To_verify_that_a_camp_conducted_by_IMPLEMENTATION_PARTNER_with_camp_type_CONTRIBUTION_for_country_INDIA_is_created_successfully', async ({ page }) => {
  const data = loadRuntimeData();
  const uniqueCampName = `AUTO_CONTRI_${Date.now()}`;

  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_62_To_verify_that_a_camp_conducted_by_IMPLEMENTATION_PARTNER_with_camp_type_CONTRIBUTION_for_country_INDIA_is_created_successfully.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form and fill mandatory camp details', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.fillCreateCampClusterForm(page, data, {
      country: 'India',
      campName: uniqueCampName
    });
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campThemeField,
      'S2E',
      'Camp Theme'
    );
    await digiteyescampsManagecampsclusterHelpers.fillAddressInformation(page, { country: 'India' });
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.startDateField,
      '2026-04-13',
      'Start Date'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.endDateField,
      '2026-04-20',
      'End Date'
    );
  });

  await test.step('Set Implementation Partner and Contribution camp type details', async () => {
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.conductedByField,
      'Implementation Partner',
      'Conducted By'
    );
    await digiteyescampsManagecampsclusterHelpers.trySelectFirstAvailableOption(
      page,
      digiteyescampsManagecampsclusterSelectors.ipNameField,
      'IP Name'
    );
    await digiteyescampsManagecampsclusterHelpers.trySelectFirstAvailableOption(
      page,
      digiteyescampsManagecampsclusterSelectors.ipTeamField,
      'IP Team'
    );
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.campTypeField,
      'Contribution',
      'Camp Type'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.readerSalePriceField,
      '0.04',
      'Reader Sale Price'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.rxAmountField,
      '0.05',
      'Rx Amount'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.popinSalePriceField,
      '0.07',
      'Popin Sale Price'
    );
    await digiteyescampsManagecampsclusterHelpers.fillFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.popinAmountField,
      '0.08',
      'Popin Amount'
    );
    await digiteyescampsManagecampsclusterHelpers.setCheckboxState(
      page,
      digiteyescampsManagecampsclusterSelectors.fullAddressCheckbox,
      true,
      'Full Address'
    );
    await digiteyescampsManagecampsclusterHelpers.setCheckboxState(
      page,
      digiteyescampsManagecampsclusterSelectors.prescreeningCheckbox,
      true,
      'Prescreening'
    );
    await digiteyescampsManagecampsclusterHelpers.setCheckboxState(
      page,
      digiteyescampsManagecampsclusterSelectors.preExamCheckbox,
      true,
      'Pre Exam'
    );
    await digiteyescampsManagecampsclusterHelpers.setCheckboxState(
      page,
      digiteyescampsManagecampsclusterSelectors.fflAtPrescreeningCheckbox,
      true,
      'FFL at Prescreening'
    );
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.asstManagerField,
      'Mammoth 2',
      'Assistant Manager'
    );
  });

  await test.step('Save camp cluster and verify user returns to listing page', async () => {
    await digiteyescampsManagecampsclusterHelpers.clickSave(page);
    await digiteyescampsManagecampsclusterHelpers.verifyManageCampClusterLanding(page);
    await digiteyescampsManagecampsclusterHelpers.expectListingTableHasRows(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
