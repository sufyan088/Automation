const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsCountrysettingsHelpers
} = require('./_shared');

test("TC_03_To_verify_that__user_can_select_Country_Settings_under_DigitEYES_Settings_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/CountrySettings/TC_03_To_verify_that__user_can_select_Country_Settings_under_DigitEYES_Settings_button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsCountrysettingsHelpers.openModule(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

