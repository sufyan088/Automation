const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_07_To_Verify_that_Address_Information_can_be_entered_and_mandatory_fields_are_validated", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_07_To_Verify_that_Address_Information_can_be_entered_and_mandatory_fields_are_validated.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open New Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
  });

  await test.step('Enter Address Information values', async () => {
    await digiteyescampsManagecampsclusterHelpers.fillAddressInformation(page, {
      country: data.visionSpringCountry
    });
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.locationField,
      '15130 Whittier Blvd',
      'Location Name'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.addressField,
      'United States',
      'Address'
    );
    await digiteyescampsManagecampsclusterHelpers.expectFieldValue(
      page,
      digiteyescampsManagecampsclusterSelectors.cityField,
      'Whittier',
      'City'
    );
    await digiteyescampsManagecampsclusterHelpers.expectSelectedOption(
      page,
      digiteyescampsManagecampsclusterSelectors.stateField,
      'Andaman and Nicobar Islands',
      'State'
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
