const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportipteamsHelpers
} = require('./_shared');

test("TC_14_To_verify_the_Clear_button_functionality_for_the_Date_To_field", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportIPTeams/TC_14_To_verify_the_Clear_button_functionality_for_the_Date_To_field.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportipteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportipteamsHelpers.clearDateTo(page, '2026-03-02');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
