const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsDesalesforcefieldmappingHelpers
} = require('./_shared');

test('TC_05_To_verify_that_the_page_is_displaying_all_the_records_of_the_DE_Salesforce_page_on_the_single_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/DESalesforceFieldMapping/TC_05_To_verify_that_the_page_is_displaying_all_the_records_of_the_DE_Salesforce_page_on_the_single_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify DE Salesforce records are displayed on one page', async () => {
    await digiteyessettingsDesalesforcefieldmappingHelpers.verifySinglePageRecords(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});