const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingInternetavailabilityHelpers
} = require('./_shared');

test("TC_06_To_verify_that_On_the_Date_To_field_a_calendar_opens_and_it_also_has_a_Today_button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/InternetAvailability/TC_06_To_verify_that_On_the_Date_To_field_a_calendar_opens_and_it_also_has_a_Today_button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingInternetavailabilityHelpers.openModule(page, data);
    await digiteyesreportingInternetavailabilityHelpers.verifyDateToSelection(page, '2026-03-04');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});