const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesreportingSummarysheetdataHelpers
} = require('./_shared');

test("TC_01_To_verify_that_the_Summary_Sheet_Data_is_displayed_under_DigitEYES_Reporting", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESReporting/SummarySheetData/TC_01_To_verify_that_the_Summary_Sheet_Data_is_displayed_under_DigitEYES_Reporting.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Summary Sheet Data report from DigitEYES Reporting', async () => {
    await digiteyesreportingSummarysheetdataHelpers.openModule(page, data);
  });

  await test.step('Verify Summary Sheet Data report is displayed', async () => {
    await digiteyesreportingSummarysheetdataHelpers.verifySummarySheetDataPage(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
