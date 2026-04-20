const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingWorkreportipteamsHelpers
} = require('./_shared');

test("TC_04_To_verify_that_the_Project_Code_field_on_the_Search_Filter_page_allows_users_to_filter_data", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/WorkReportIPTeams/TC_04_To_verify_that_the_Project_Code_field_on_the_Search_Filter_page_allows_users_to_filter_data.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step(test.info().title.replace(/^TC_\d+_/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().replace(/^To verify\b/i, 'Verify').replace(/\.$/, ''), async () => {
    await digiteyesreportingWorkreportipteamsHelpers.openModule(page, data);
    await digiteyesreportingWorkreportipteamsHelpers.verifyProjectCodeField(page, 'ALI18SSINDIVP110CHIC');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});