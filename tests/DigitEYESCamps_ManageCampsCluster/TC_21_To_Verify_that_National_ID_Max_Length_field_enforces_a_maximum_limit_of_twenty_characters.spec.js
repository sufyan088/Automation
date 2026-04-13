const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_21_To_Verify_that_National_ID_Max_Length_field_enforces_a_maximum_limit_of_twenty_characters', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_21_To_Verify_that_National_ID_Max_Length_field_enforces_a_maximum_limit_of_twenty_characters.ds'
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

  await test.step('Enter value exceeding max length in National ID Max Length field', async () => {
    const nidMaxLengthField = page.locator('#DE_Camp_nidmaxlength');
    const testValue = '120987656789098765432'; // 21 characters
    await nidMaxLengthField.fill(testValue);
    await page.waitForTimeout(300);
    
    const actualValue = await nidMaxLengthField.inputValue();
    expect(actualValue.length).toBeLessThanOrEqual(20);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
