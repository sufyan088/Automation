const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_23_To_Verify_that_Currency_field_is_auto_populated_as_INR_when_India_is_selected_as_Country', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_23_To_Verify_that_Currency_field_is_auto_populated_as_INR_when_India_is_selected_as_Country.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      'India',
      'Country'
    );
  });

  await test.step('Verify currency field is auto-populated with INR', async () => {
    const currencyField = page.locator('#DE_Camp_currency');
    await expect(currencyField).not.toHaveValue('', { timeout: 10000 });
    const currencyValue = await currencyField.inputValue();
    expect(currencyValue).toContain('INR');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
