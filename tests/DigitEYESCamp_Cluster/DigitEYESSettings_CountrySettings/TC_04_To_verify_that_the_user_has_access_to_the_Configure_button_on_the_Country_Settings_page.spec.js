const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsCountrysettingsHelpers
} = require('./_shared');

test("TC_04_To_verify_that_the_user_has_access_to_the_Configure_button_on_the_Country_Settings_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/CountrySettings/TC_04_To_verify_that_the_user_has_access_to_the_Configure_button_on_the_Country_Settings_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyessettingsCountrysettingsHelpers.verifyConfigureButton(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});

