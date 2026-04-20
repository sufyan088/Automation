const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_11_To_Verify_that_clicking_the_Show_Dates_button_displays_correct_Camp_dates", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_11_To_Verify_that_clicking_the_Show_Dates_button_displays_correct_Camp_dates.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and show the camp dates', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.clickShowDatesAndExpectCampDates(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
