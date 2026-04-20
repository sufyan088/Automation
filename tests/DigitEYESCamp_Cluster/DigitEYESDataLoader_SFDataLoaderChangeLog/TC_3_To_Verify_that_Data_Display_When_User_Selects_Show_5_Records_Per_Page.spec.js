const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderchangelogHelpers
} = require('./_shared');

test("TC_3_To_Verify_that_Data_Display_When_User_Selects_Show_5_Records_Per_Page", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderChangeLog/TC_3_To_Verify_that_Data_Display_When_User_Selects_Show_5_Records_Per_Page.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Change Log page and switch the page size to 5', async () => {
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderchangelogHelpers.selectPageSizeAndExpectMaxRows(page, '5');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
