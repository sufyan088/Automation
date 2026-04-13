const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsCountrysettingsHelpers
} = require('./_shared');

test('TC_06_To_verify_the_Prescreening_Station_checkbox_check_and_uncheck_functionality_is_reflected_on_the_manage_camps_cluster_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/CountrySettings/TC_06_To_verify_the_Prescreening_Station_checkbox_check_and_uncheck_functionality_is_reflected_on_the_manage_camps_cluster_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Prescreening setting reflects on Manage Camp Cluster', async () => {
    await digiteyessettingsCountrysettingsHelpers.verifyCheckboxReflection(page, data, 'prescreening');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});