const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingSummarysheetdataHelpers
} = require('./_shared');

test('TC_04_To_Verify_that_the_user_can_select_the_S2L_theme_from_the_All_Themes_dropdown_and_run_the_report', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/SummarySheetData/TC_04_To_Verify_that_the_user_can_select_the_S2L_theme_from_the_All_Themes_dropdown_and_run_the_report.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Summary Sheet Data report from DigitEYES Reporting', async () => {
    await digiteyesreportingSummarysheetdataHelpers.openModule(page, data);
  });

  await test.step('Select S2L theme and run the report', async () => {
    await digiteyesreportingSummarysheetdataHelpers.runThemeReport(page, { theme: 'S2L' });
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
