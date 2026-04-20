const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsHospitalsHelpers
} = require('./_shared');

test('TC_12_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_the_same_country_shown_in_the_Country_dropdown_on_the_Hospital_Search_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/Hospitals/TC_12_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_the_same_country_shown_in_the_Country_dropdown_on_the_Hospital_Search_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify Hospital search country matches selected country', async () => {
    await digiteyessettingsHospitalsHelpers.verifyCountryDropdown(page, data, data.visionSpringCountry);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});