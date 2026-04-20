const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderchangelogHelpers
} = require('./_shared');

test("TC_2_To_Verify_that_Seven_Columns_Are_Displayed_on_Salesforce_Data_Loader_Change_Log", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderChangeLog/TC_2_To_Verify_that_Seven_Columns_Are_Displayed_on_Salesforce_Data_Loader_Change_Log.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Change Log page and verify the expected columns', async () => {
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderchangelogHelpers.expectListingHeaders(page, [
      'Camp Information',
      'Participant ID',
      'SF Field Name',
      'Original Value',
      'Modified Value',
      'Modified by',
      'Modification Date'
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
