const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test('TC_10_To_Verify_that_clicking_the_Search_Filter_button_opens_the_Queue_Search_Filter_popup_page', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_10_To Verify that clicking the Search Filter button opens the “Salesforce Data Loader - Queue - Search Filter popup page.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open queue page and verify search filter popup is displayed', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloaderqueueHelpers.verifySearchFilterHeadingVisible(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
