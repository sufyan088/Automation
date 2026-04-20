const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsCountrysettingsHelpers
} = require('./_shared');

test('TC_02_To_verify_that_After_clicking_on_DigitEYES_Settings_four_additional_options_are_displayed_under_it', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/CountrySettings/TC_02_To_verify_that_After_clicking_on_DigitEYES_Settings_four_additional_options_are_displayed_under_it.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Settings submenu options are displayed', async () => {
    await digiteyessettingsCountrysettingsHelpers.verifySettingsOptions(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});