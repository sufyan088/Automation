const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test("TC_3_To_Verify_that_error_case_records_are_displayed _in_a_proper_tabular_format", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_3_To_Verify_that_error_case_records_are_displayed _in_a_proper_tabular_format.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases and verify rows render in the table', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.expectListingHeaders(page, ['Camp ID', 'Participant ID', 'Participant Name']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
