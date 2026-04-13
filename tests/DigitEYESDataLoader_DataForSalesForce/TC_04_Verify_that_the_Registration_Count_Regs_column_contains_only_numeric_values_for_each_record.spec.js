const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderDataforsalesforceHelpers
} = require('./_shared');

test("TC_04_Verify_that_the_Registration_Count_Regs_column_contains_only_numeric_values_for_each_record", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/DataForSalesForce/TC_04_Verify_that_the_Registration_Count_Regs_ column_contains_only_numeric_values_for_each_record.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Data for Salesforce and verify #Regs column contains only numeric values', async () => {
    await digiteyesdataloaderDataforsalesforceHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderDataforsalesforceHelpers.expectColumnValuesNumeric(page, ['#Regs.', '#Regs', 'Regs']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
