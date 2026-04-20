const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_12_To_Verify_that_all_filter_fields_are_displayed_correctly_In_Search_Filter_popup", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_12_To_Verify_that_all_filter_fields_are_displayed_correctly_In_Search_Filter_popup.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page and verify the search filter fields', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderqueueHelpers.verifySearchFilterFields(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
