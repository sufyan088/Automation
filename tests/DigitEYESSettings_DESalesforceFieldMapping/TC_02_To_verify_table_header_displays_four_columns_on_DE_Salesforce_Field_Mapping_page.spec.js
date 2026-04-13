const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsDesalesforcefieldmappingHelpers
} = require('./_shared');

test('TC_02_To_verify_table_header_displays_four_columns_on_DE_Salesforce_Field_Mapping_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/DESalesforceFieldMapping/TC_02_To_verify_table_header_displays_four_columns_on_DE_Salesforce_Field_Mapping_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify DE Salesforce Field Mapping table headers', async () => {
    await digiteyessettingsDesalesforcefieldmappingHelpers.verifyHeaders(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});