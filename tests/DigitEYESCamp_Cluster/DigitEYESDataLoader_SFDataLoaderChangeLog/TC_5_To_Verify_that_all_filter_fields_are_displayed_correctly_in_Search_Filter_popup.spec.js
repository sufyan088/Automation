const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderchangelogHelpers
} = require('./_shared');

test("TC_5_To_Verify_that_all_filter_fields_are_displayed_correctly_in_Search_Filter_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderChangeLog/TC_5_To_Verify_that_all_filter_fields_are_displayed_correctly_in_Search_Filter_popup.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Change Log page and verify the search filter fields', async () => {
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderchangelogHelpers.verifySearchFilterFields(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
