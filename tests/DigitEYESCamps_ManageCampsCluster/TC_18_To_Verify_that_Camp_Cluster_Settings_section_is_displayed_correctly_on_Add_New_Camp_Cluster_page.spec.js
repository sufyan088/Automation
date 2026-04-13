const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_18_To_Verify_that_Camp_Cluster_Settings_section_is_displayed_correctly_on_Add_New_Camp_Cluster_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_18_To_Verify_that_Camp_Cluster_Settings_section_is_displayed_correctly_on_Add_New_Camp_Cluster_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster form and verify Camp Cluster Settings fields', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.selectDropdownValue(
      page,
      digiteyescampsManagecampsclusterSelectors.countryField,
      'India',
      'Country'
    );
    await page.waitForTimeout(500);
    
    // Verify Mobile No. Prefix field is visible
    await expect(page.locator('#DE_Camp_mobilenoprefix')).toBeVisible();
    
    // Verify Vision Chart field is visible
    await expect(page.locator('#DE_Camp_visionchart')).toBeVisible();
    
    // Verify National ID max length field is visible
    await expect(page.locator('#DE_Camp_nidmaxlength')).toBeVisible();
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
