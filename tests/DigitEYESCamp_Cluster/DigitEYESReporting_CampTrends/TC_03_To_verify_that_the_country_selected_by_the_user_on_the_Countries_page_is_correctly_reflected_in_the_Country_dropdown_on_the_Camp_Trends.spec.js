const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingCamptrendsHelpers
} = require('./_shared');

test("TC_03_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_correctly_reflected_in_the_Country_dropdown_on_the_Camp_Trends", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/CampTrends/TC_03_To_verify_that_the_country_selected_by_the_user_on_the_Countries_page_is_correctly_reflected_in_the_Country_dropdown_on_the_Camp_Trends.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingCamptrendsHelpers.openModule(page, data);
    await digiteyesreportingCamptrendsHelpers.verifyCountryDropdown(page, data.visionSpringCountry);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});