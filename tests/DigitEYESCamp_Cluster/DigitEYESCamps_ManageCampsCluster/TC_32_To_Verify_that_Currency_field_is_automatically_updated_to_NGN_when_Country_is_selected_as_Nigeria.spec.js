const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_32_To_Verify_that_Currency_field_is_automatically_updated_to_NGN_when_Country_is_selected_as_Nigeria', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_32_To_Verify_that_Currency_field_is_automatically_updated_to_NGN_when_Country_is_selected_as_Nigeria.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster for Nigeria and create form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, 'Nigeria');
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      'Nigeria',
      'Country'
    );
  });

  await test.step('Verify currency is NGN', async () => {
    const currencyField = page.locator('#DE_Camp_currency');
    await expect(currencyField).not.toHaveValue('', { timeout: 10000 });
    const currencyValue = await currencyField.inputValue();
    expect(currencyValue).toContain('NGN');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
