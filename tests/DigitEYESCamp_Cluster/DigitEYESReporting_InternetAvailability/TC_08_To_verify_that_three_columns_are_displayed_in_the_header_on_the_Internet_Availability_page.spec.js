const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingInternetavailabilityHelpers
} = require('./_shared');

test("TC_08_To_verify_that_three_columns_are_displayed_in_the_header_on_the_Internet_Availability_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/InternetAvailability/TC_08_To_verify_that_three_columns_are_displayed_in_the_header_on_the_Internet_Availability_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingInternetavailabilityHelpers.openModule(page, data);
    await digiteyesreportingInternetavailabilityHelpers.verifyHeaders(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});