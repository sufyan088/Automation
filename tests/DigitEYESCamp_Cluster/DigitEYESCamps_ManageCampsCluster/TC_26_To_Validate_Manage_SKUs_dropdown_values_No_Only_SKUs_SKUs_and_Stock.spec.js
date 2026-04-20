const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test("TC_26_To_Validate_Manage_SKUs_dropdown_values_No_Only_SKUs_SKUs_and_Stock", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_26_To_Validate_Manage_SKUs_dropdown_values_No_Only_SKUs_SKUs_and_Stock.ds"
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

  await test.step('Verify Manage SKUs dropdown contains the expected values', async () => {
    await digiteyescampsManagecampsclusterHelpers.expectDropdownOptions(
      page,
      digiteyescampsManagecampsclusterSelectors.manageSkuField,
      ['No', 'Only SKU', 'SKU & Stock'],
      'Manage SKUs'
    );
    for (const option of ['No', 'Only SKU', 'SKU & Stock']) {
      await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
        page,
        digiteyescampsManagecampsclusterSelectors.manageSkuField,
        option,
        'Manage SKUs'
      );
      await digiteyescampsManagecampsclusterHelpers.expectSelectedOption(
        page,
        digiteyescampsManagecampsclusterSelectors.manageSkuField,
        option,
        'Manage SKUs'
      );
    }
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
