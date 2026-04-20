const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportvsteamsHelpers
} = require('./_shared');

test("TC_09_To_verify_that_clicking_the_Apply_button_on_the_Search_Filter_page_applies_the_selected_filters_and_displays_the_correct_results", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportVSTeams/TC_09_To_Verify_that_clicking_the_Apply_button_on_the_Search_Filter_page_applies_the_selected_filters_and_displays_the_correct_results.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportvsteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportvsteamsHelpers.applyProjectCodeFilter(page, 'ALI18SSINDIVP110CHIC');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});