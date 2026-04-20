const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyescampsDataforsalesforceHelpers
} = require('./_shared');

test("TC_12_To_Verify_that_Registration_Count_Regs_column_displays_only_numeric_values", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESCamps/DataForSalesforce/TC_12_To_Verify_that_Registration_Count_Regs_column_displays_only_numeric_values.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify the registration count column is numeric', async () => {
    await digiteyescampsDataforsalesforceHelpers.openModule(page, data.visionSpringCountry);
    await digiteyescampsDataforsalesforceHelpers.expectListingHeaders(page, ['#Regs.']);
    await digiteyescampsDataforsalesforceHelpers.expectColumnValuesNumeric(page, '#Regs.');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
