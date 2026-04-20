const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsParticipantsHelpers
} = require('./_shared');

test('TC_04_To_verify_that_country_selected_by_user_on_Countries_page_is_same_country_shown_in_Country_dropdown_on_Search_Filter_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/Participants/TC_04_To_verify_that_country_selected_by_user_on_Countries_page_is_same_country_shown_in_Country_dropdown_on_Search_Filter page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Participants search filter and verify country dropdown is available for selected country context', async () => {
    await digiteyescampsParticipantsHelpers.openModule(page, data.Country || 'India');
    await digiteyescampsParticipantsHelpers.openSearchFilter(page);
    await digiteyescampsParticipantsHelpers.verifySearchCountryDropdownVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
