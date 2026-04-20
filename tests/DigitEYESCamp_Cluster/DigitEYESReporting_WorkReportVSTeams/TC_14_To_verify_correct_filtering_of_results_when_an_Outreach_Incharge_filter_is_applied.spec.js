const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportvsteamsHelpers
} = require('./_shared');

test("TC_14_To_verify_correct_filtering_of_results_when_an_Outreach_Incharge_filter_is_applied", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportVSTeams/TC_14_To_verify_correct_filtering_of_results_when_an_Outreach_Incharge_filter_is_applied.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportvsteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportvsteamsHelpers.filterByOutreachIncharge(page, 'Sani Malik');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
