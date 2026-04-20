const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingPopinavailabilityHelpers
} = require('./_shared');

test("TC_04_To__Verify_that_the_All_Themes_dropdown_allows_the_user_to_select_the_S2L_theme_on_the_Popins_Availability_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/PopinAvailability/TC_04_To__Verify_that_the_All_Themes_dropdown_allows_the_user_to_select_the_S2L_theme_on_the_Popins_Availability_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/^To Verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingPopinavailabilityHelpers.openModule(page, data);
    await digiteyesreportingPopinavailabilityHelpers.verifyThemeSelection(page, 'S2L');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});