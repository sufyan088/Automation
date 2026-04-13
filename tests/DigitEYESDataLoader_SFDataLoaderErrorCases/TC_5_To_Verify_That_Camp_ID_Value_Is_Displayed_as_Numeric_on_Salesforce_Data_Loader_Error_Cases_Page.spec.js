const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test('TC_5_To_Verify_That_Camp_ID_Value_Is_Displayed_as_Numeric_on_Salesforce_Data_Loader_Error_Cases_Page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_5_To_Verify_That_Camp_ID_Value_Is_Displayed_as_Numeric_on_Salesforce_Data_Loader_Error_Cases_Page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and verify Camp ID values are numeric', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.expectColumnValuesNumeric(page, ['Camp ID', 'Camp Id', 'CampID']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
