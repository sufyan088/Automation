const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_24_Verify_that_the_user_can_select_any_available_Assistant_Manager_from_the_Asst_Managers_dropdown', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_24_Verify_that_the_user_can_select_any_available_Assistant_Manager_from_the_Asst_Managers_dropdown.ds'
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

  await test.step('Select Assistant Manager from dropdown', async () => {
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.asstManagerField,
      'Mammoth 2',
      'Assistant Manager'
    );
    await page.waitForTimeout(300);
  });

  await test.step('Verify Assistant Manager is selected', async () => {
    const asstManagerField = page.locator('#DE_Camp_asstmanager');
    const selectedValue = await asstManagerField.evaluate(select => {
      const selectedOption = select.options[select.selectedIndex];
      return selectedOption ? selectedOption.textContent : '';
    });
    expect(selectedValue).toContain('Mammoth 2');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
