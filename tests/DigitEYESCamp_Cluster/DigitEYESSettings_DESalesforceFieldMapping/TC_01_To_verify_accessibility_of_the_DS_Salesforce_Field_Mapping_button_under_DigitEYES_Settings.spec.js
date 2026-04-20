const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyessettingsDesalesforcefieldmappingHelpers
} = require('./_shared');

test('TC_01_To_verify_accessibility_of_the_DS_Salesforce_Field_Mapping_button_under_DigitEYES_Settings', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESSettings/DESalesforceFieldMapping/TC_01_To_verify_accessibility_of_the_DS_Salesforce_Field_Mapping_button_under_DigitEYES_Settings.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Verify DE Salesforce Field Mapping page is accessible', async () => {
    await digiteyessettingsDesalesforcefieldmappingHelpers.openModule(page, data);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});