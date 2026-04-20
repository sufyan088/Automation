const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test("TC_13_Verify_that_Apply_button_functionality_on_Camp_Cluster_Data_Search_Filter_page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_13_Verify_that_Apply_button_functionality_on_Camp_Cluster_Data_Search_Filter_page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and apply the search filter', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.applySearchFilterUsingTableData(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
