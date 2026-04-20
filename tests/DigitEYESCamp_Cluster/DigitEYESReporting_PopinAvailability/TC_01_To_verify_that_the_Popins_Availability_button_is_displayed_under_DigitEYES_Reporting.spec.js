const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingPopinavailabilityHelpers
} = require('./_shared');

test("TC_01_To_verify_that_the_Popins_Availability_button_is_displayed_under_DigitEYES_Reporting", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/PopinAvailability/TC_01_To_verify_that_the_Popins_Availability_button_is_displayed_under_DigitEYES_Reporting.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingPopinavailabilityHelpers.openModule(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
