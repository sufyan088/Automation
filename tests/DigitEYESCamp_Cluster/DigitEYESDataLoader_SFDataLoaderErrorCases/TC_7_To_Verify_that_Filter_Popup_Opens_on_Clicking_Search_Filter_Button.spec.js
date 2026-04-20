const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test("TC_7_To_Verify_that_Filter_Popup_Opens_on_Clicking_Search_Filter_Button", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_7_To_Verify_that_Filter_Popup_Opens_on_Clicking_Search_Filter_Button.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and open the search filter', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openSearchFilter(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
