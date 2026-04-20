const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_33_To_Verify_that_Currency_field_is_automatically_updated_to_KES_when_Country_is_selected_as_Uganda', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_33_To_Verify_that_Currency_field_is_automatically_updated_to_KES_when_Country_is_selected_as_Uganda.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster for Uganda and create form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, 'Uganda');
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      'Uganda',
      'Country'
    );
  });

  await test.step('Verify currency is KES', async () => {
    const currencyField = page.locator('#DE_Camp_currency');
    await expect(currencyField).not.toHaveValue('', { timeout: 10000 });
    const currencyValue = await currencyField.inputValue();
    expect(currencyValue).toContain('KES');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
