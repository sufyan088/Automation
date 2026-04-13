const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test('TC_16_To_Verify_that_pagination_functionality_on_Error_Cases_page_is_working_Correctly', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_16_To_Verify_that_pagination_functionality_on_Error_Cases_page_is_working_Correctly .ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and verify pagination links are clickable', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.clickPaginationPage(page, 2);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.clickPaginationPage(page, 3);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.clickPaginationPage(page, 6);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.verifyPageLoaded(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
