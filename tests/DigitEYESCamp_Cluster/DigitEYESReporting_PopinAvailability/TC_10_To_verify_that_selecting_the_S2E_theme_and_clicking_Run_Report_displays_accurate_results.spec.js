const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingPopinavailabilityHelpers
} = require('./_shared');

test("TC_10_To_verify_that_selecting_the_S2E_theme_and_clicking_Run_Report_displays_accurate_results", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/PopinAvailability/TC_10_To_verify_that_selecting_the_S2E_theme_and_clicking_Run_Report_displays_accurate_results.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingPopinavailabilityHelpers.openModule(page, data);
    await digiteyesreportingPopinavailabilityHelpers.runThemeReport(page, {
      dateFrom: '2026-02-10',
      dateTo: '2026-03-04',
      theme: 'S2E'
    });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});