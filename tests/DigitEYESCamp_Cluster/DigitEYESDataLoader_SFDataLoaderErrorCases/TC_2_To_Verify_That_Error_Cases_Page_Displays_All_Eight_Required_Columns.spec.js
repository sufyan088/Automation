const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test("TC_2_To_Verify_That_Error_Cases_Page_Displays_All_Eight_Required_Columns", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_2_To_Verify_That_Error_Cases_Page_Displays_All_Eight_Required_Columns.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and verify the expected columns', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.expectListingHeaders(page, [
      'Camp ID',
      'Camp Date',
      'Location',
      'Country',
      'Participant ID',
      'Participant Name',
      'Status',
      'Assigned'
    ]);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
