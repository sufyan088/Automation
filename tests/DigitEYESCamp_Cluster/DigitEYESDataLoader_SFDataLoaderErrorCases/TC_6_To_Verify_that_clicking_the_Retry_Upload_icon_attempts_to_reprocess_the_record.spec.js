const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test("TC_6_To_Verify_that_clicking_the_Retry_Upload_icon_attempts_to_reprocess_the_record", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_6_To_Verify_that_clicking_the_Retry_Upload_icon_attempts_to_reprocess_the_record.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and retry the first upload', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.retryFirstUpload(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
