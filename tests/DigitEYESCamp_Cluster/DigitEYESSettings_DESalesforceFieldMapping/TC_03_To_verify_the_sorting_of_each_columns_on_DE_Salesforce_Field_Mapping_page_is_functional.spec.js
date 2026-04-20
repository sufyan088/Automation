const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsDesalesforcefieldmappingHelpers
} = require('./_shared');

test('TC_03_To_verify_the_sorting_of_each_columns_on_DE_Salesforce_Field_Mapping_page_is_functional', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/DESalesforceFieldMapping/TC_03_To_verify_the_sorting_of_each_columns_on_DE_Salesforce_Field_Mapping_page_is functional.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify DE Salesforce Field Mapping sorting', async () => {
    await digiteyessettingsDesalesforcefieldmappingHelpers.verifySorting(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});