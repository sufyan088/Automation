const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderchangelogHelpers
} = require('./_shared');

test('TC_7_To_Verify_that_Close_button_functionality_on_Camp_Cluster_Data_Search_Filter_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderChangeLog/TC_7_To_Verify_that_Close_button_functionality_on_Camp_Cluster_Data_Search_Filter_page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Change Log page and verify Close closes the search/filter modal', async () => {
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderchangelogHelpers.closeSearchFilter(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
