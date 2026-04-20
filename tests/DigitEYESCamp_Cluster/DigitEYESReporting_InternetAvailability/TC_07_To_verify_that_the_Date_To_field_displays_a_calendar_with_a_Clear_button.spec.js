const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingInternetavailabilityHelpers
} = require('./_shared');

test("TC_07_To_verify_that_the_Date_To_field_displays_a_calendar_with_a_Clear_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/InternetAvailability/TC_07_To_verify_that_the_Date_To_field_displays_a_calendar_with_a_Clear_button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingInternetavailabilityHelpers.openModule(page, data);
    await digiteyesreportingInternetavailabilityHelpers.clearDateTo(page, '2026-03-02');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
