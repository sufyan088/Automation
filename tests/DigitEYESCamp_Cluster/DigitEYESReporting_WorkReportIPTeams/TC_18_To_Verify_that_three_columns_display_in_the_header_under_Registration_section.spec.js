const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportipteamsHelpers
} = require('./_shared');

test("TC_18_To_Verify_that_three_columns_display_in_the_header_under_Registration_section", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportIPTeams/TC_18_To_Verify_that_three_columns_display_in_the_header_under_Registration_section.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportipteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportipteamsHelpers.verifyRegistrationHeaders(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
