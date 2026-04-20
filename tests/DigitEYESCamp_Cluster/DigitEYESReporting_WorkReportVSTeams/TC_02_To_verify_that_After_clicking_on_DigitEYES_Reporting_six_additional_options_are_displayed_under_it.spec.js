const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportvsteamsHelpers
} = require('./_shared');

test("TC_02_To_verify_that_After_clicking_on_DigitEYES_Reporting_six_additional_options_are_displayed_under_it", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportVSTeams/TC_02_To_verify_that_After_clicking_on_DigitEYES_Reporting,_six_additional_options_are_displayed_under_it.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportvsteamsHelpers.verifyReportingMenuOptions(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});