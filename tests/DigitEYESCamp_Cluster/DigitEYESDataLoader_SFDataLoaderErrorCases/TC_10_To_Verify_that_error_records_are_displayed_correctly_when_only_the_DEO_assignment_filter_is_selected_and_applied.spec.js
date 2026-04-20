const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test('TC_10_To_Verify_that_error_records_are_displayed_correctly_when_only_the_DEO_assignment_filter_is_selected_and_applied', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_10_To_Verify_that_error_records_are_displayed_correctly_when_only_the_DEO_assignment_filter_is_selected_and_applied.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases, apply DEO assignment filter and verify filtered records', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.applySearchFilterUsingTableData(page);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.expectColumnContainsValue(page, ['Assigned', 'Assignment', 'Assigned To'], 'DEO');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
