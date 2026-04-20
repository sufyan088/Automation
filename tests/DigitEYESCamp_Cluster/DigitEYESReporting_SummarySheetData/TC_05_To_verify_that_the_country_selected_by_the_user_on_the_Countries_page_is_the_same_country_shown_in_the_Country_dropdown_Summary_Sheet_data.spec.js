const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingSummarysheetdataHelpers
} = require('./_shared');

test('TC_05_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_the_same_country_shown_in_the_Country_dropdown_Summary_Sheet_data', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/SummarySheetData/TC_05_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_the_same_country_shown_in_the_Country_dropdown_Summary_Sheet_data.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Summary Sheet Data report from DigitEYES Reporting', async () => {
    await digiteyesreportingSummarysheetdataHelpers.openModule(page, data);
  });

  await test.step('Verify the selected country is reflected in the Summary Sheet Data country dropdown', async () => {
    await digiteyesreportingSummarysheetdataHelpers.verifyCountryDropdown(page, data.visionSpringCountry);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});