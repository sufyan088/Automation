const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportvsteamsHelpers
} = require('./_shared');

test("TC_16_To_verify_that_the_Date_To_field_on_the_Search_Report_page_is_functional_and_allows_the_user_to_select_a_date_correctly", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportVSTeams/TC_16_To_verify_that_the_Date_To_field_on_the_Search_Report_page_is_functional_and_allows_the_user_to_select_a_date_correctly.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportvsteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportvsteamsHelpers.verifyDateTo(page, '2026-02-24');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});