const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportipteamsHelpers
} = require('./_shared');

test("TC_12_To_verify_that _Date_To_field_is_functional_on_Search_Filter_Report_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportIPTeams/TC_12_To_verify_that _Date_To_field_is_functional_on_Search_Filter_Report_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportipteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportipteamsHelpers.verifyDateTo(page, '2026-03-02');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
