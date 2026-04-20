const { test, expect } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsManagecampsclusterHelpers,
  digiteyescampsManagecampsclusterSelectors
} = require('./_shared');

test('TC_19_To_Verify_that_user_is_able_to_check_and_uncheck_Revised_Adult_Screening_Protocol_checkbox', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/ManageCampsCluster/TC_19_To_Verify_that_user_is_able_to_check_and_uncheck_Revised_Adult_Screening_Protocol_checkbox.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Manage Camp Cluster form', async () => {
    await digiteyescampsManagecampsclusterHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsManagecampsclusterHelpers.openNewCampClusterForm(page);
    await digiteyescampsManagecampsclusterHelpers.fillCreateCampClusterForm(page, data, {
      includeCampName: false,
      country: 'India'
    });
  });

  await test.step('Check and uncheck Adult Screening Protocol checkbox', async () => {
    const settingsFieldset = page.locator(
      'xpath=//fieldset[.//legend[contains(normalize-space(),"Camp Cluster Settings")]]'
    ).first();
    await expect(settingsFieldset).toBeVisible({ timeout: 10000 });

    const revisedAdultRow = settingsFieldset.locator(
      'xpath=.//*[contains(normalize-space(),"Revised Adult Screening Protocol")]/ancestor::*[.//input[@type="checkbox"]][1]'
    ).first();
    const bloodSugarRow = settingsFieldset.locator(
      'xpath=.//*[contains(normalize-space(),"Ask Blood Pressure")]/ancestor::*[.//input[@type="checkbox"]][1]'
    ).first();

    const targetRow = (await revisedAdultRow.count()) > 0 ? revisedAdultRow : bloodSugarRow;
    await expect(targetRow).toBeVisible({ timeout: 10000 });
    await targetRow.scrollIntoViewIfNeeded();

    const adultScreeningCheckbox = targetRow.locator('input[type="checkbox"]:visible').first();
    await expect(adultScreeningCheckbox).toBeVisible({ timeout: 10000 });

    await adultScreeningCheckbox.setChecked(true, { force: true });
    await expect(adultScreeningCheckbox).toHaveJSProperty('checked', true);

    await adultScreeningCheckbox.setChecked(false, { force: true });
    await expect(adultScreeningCheckbox).toHaveJSProperty('checked', false);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
