const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingInternetavailabilityHelpers
} = require('./_shared');

test("TC_09_To_verify_that_the_Run_Report_button_functions_correctly_and_updates_the_statistics_on_the_Internet_Availability_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/InternetAvailability/TC_09_To_verify_that_the_Run_Report_button_functions_correctly_and_updates_the_statistics_on_the_Internet_Availability_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingInternetavailabilityHelpers.openModule(page, data);
    await digiteyesreportingInternetavailabilityHelpers.runReport(page, {
      dateFrom: '2025-03-11',
      dateTo: '2026-03-18'
    });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});