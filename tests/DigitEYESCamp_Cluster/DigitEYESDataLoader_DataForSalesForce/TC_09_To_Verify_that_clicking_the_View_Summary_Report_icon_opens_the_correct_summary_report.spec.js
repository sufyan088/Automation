const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_09_To_Verify_that_clicking_the_View_Summary_Report_icon_opens_the_correct_summary_report", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_09_To_Verify_that_clicking_the_View_Summary_Report_ icon_opens_the_correct_summary_report.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and click View Summary Report, verify heading is displayed', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.openFirstViewSummaryReport(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
