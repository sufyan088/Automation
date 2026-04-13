const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloadererrorcasesHelpers
} = require('./_shared');

test('TC_12_To_Verify_that_error_records_are_displayed_correctly_when_both_DEO_and_Super_DEO_assignment_filters_are_selected_and_applied', async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: 'source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderErrorCases/TC_12_To_Verify_that_error_records_are_displayed_correctly_when_both_DEO_and_Super_DEO_assignment_filters_are_selected_and_applied.ds'
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open Error Cases, apply DEO and Super DEO filters and verify both appear in filtered records', async () => {
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.openSearchFilter(page);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.applySearchFilterUsingTableData(page);
    await digiteyesdataloaderSfdataloadererrorcasesHelpers.expectColumnValuesMatchPattern(
      page,
      ['Assigned', 'Assignment', 'Assigned To'],
      /(DEO|Super\s*DEO)/i
    );
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
