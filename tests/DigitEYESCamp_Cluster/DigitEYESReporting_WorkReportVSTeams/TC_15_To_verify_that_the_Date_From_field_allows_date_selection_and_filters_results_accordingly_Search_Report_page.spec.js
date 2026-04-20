const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportvsteamsHelpers
} = require('./_shared');

test("TC_15_To_verify_that_the_Date_From_field_allows_date_selection_and_filters_results_accordingly_Search_Report_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportVSTeams/TC_15_To_verify_that_the_Date_From_field_allows_date_selection_and_filters_results_accordingly_Search_Report_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportvsteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportvsteamsHelpers.verifyDateFrom(page, '2026-02-22');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});