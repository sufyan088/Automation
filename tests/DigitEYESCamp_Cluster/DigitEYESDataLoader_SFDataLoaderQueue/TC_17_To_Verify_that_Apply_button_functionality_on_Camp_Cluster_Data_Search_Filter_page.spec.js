const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_17_To_Verify_that_Apply_button_functionality_on_Camp_Cluster_Data_Search_Filter_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_17_To_Verify_that_Apply_button_functionality_on_Camp_Cluster_Data_Search_Filter_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page and apply the search filter', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderqueueHelpers.applySearchFilterUsingTableData(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
