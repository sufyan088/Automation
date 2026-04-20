const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers,
  digiteyescampsDataforsalesforceSelectors
} = require('./_shared');

test("TC_04_To_Verify_that_View_Summary_Report_button_is_visible_for_each_camp_record", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_04_To_Verify_that_View_Summary_Report_button_is_visible_for_each_camp_record.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify View Summary Report is available', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.expectActionButtonsVisible(
      page,
      digiteyescampsDataforsalesforceSelectors.viewSummaryReportButton,
      'View Summary Report'
    );
    await digiteyescampsDataforsalesforceHelpers.openFirstViewSummaryReport(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
