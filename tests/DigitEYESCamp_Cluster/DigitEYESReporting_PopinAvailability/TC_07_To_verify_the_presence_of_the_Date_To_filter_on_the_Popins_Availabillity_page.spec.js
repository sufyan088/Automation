const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingPopinavailabilityHelpers
} = require('./_shared');

test("TC_07_To_verify_the_presence_of_the_Date_To_filter_on_the_Popins_Availabillity_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/PopinAvailability/TC_07_To_verify_the_presence_of_the_Date_To_filter_on_the_Popins_Availabillity_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingPopinavailabilityHelpers.openModule(page, data);
    await digiteyesreportingPopinavailabilityHelpers.verifyDateToPresence(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
