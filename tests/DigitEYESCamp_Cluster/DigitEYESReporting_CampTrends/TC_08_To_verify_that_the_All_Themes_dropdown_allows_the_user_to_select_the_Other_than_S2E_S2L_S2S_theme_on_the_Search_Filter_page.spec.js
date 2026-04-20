const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingCamptrendsHelpers
} = require('./_shared');

test("TC_08_To_verify_that_the_All_Themes_dropdown_allows_the_user_to_select_the_Other_than_S2E_S2L_S2S_theme_on_the_Search_Filter_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/CampTrends/TC_08_To_verify_that_the_All_Themes_dropdown_allows_the_user_to_select_the_Other_than_S2E_S2L_S2S_theme_on_the_Search_Filter_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingCamptrendsHelpers.openModule(page, data);
    await digiteyesreportingCamptrendsHelpers.verifyThemeSelection(page, 'Other than S2E, S2L, S2S');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});