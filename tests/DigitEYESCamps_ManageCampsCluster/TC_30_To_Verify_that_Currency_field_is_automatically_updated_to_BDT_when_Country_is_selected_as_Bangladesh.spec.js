const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_30_To_Verify_that_Currency_field_is_automatically_updated_to_BDT_when_Country_is_selected_as_Bangladesh', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_30_To_Verify_that_Currency_field_is_automatically_updated_to_BDT_when_Country_is_selected_as_Bangladesh.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster for Bangladesh and create form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, 'Bangladesh');
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      'Bangladesh',
      'Country'
    );
  });

  await test.step('Verify currency is BDT', async () => {
    const currencyField = page.locator('#DE_Camp_currency');
    await expect(currencyField).not.toHaveValue('', { timeout: 10000 });
    const currencyValue = await currencyField.inputValue();
    expect(currencyValue).toContain('BDT');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
