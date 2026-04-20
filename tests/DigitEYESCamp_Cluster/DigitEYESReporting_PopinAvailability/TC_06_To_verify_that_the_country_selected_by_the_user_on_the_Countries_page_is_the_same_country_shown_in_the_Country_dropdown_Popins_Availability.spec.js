const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingPopinavailabilityHelpers
} = require('./_shared');

test("TC_06_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_the_same_country_shown_in_the_Country_dropdown_Popins_Availability", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/PopinAvailability/TC_06_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_the_same_country_shown_in_the_Country_dropdown_Popins_Availability.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingPopinavailabilityHelpers.openModule(page, data);
    await digiteyesreportingPopinavailabilityHelpers.verifyCountryDropdown(page, 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});