const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderchangelogHelpers
} = require('./_shared');

test("TC_1_To_Verify_that_Change_Log_Page_Loads_Successfully", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderChangeLog/TC_1_To_Verify_that_Change_Log_Page_Loads_Successfully.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the Change Log page and verify it loads', async () => {
    await digiteyesdataloaderSfdataloaderchangelogHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
