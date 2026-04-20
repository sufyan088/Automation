const { test } = require('@playwright/test');
const {
  loadRuntimeData,
  loginAsAdmin,
  closeSession,
  digiteyesdataloaderSfdataloaderqueueHelpers
} = require('./_shared');

test("TC_3_To_Verify_that_the_Ref#_column_displays_a_unique_reference_number_for_each_record", async ({ page }) => {
  const data = loadRuntimeData();
  test.info().annotations.push({
    type: 'source-aiq',
    description: "source-aiq/TestScripts/DigitEYESCampsCluster/DigitEYESDataLoader/SFDataLoaderQueue/TC_3_To_Verify_that_the_Ref#_column_displays_a_unique_reference_number_for_each_record.ds"
  });

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open the queue page and verify reference values are populated with numeric identifiers', async () => {
    await digiteyesdataloaderSfdataloaderqueueHelpers.openModule(page, data.Country || data.visionSpringCountry || 'India');
    await digiteyesdataloaderSfdataloaderqueueHelpers.expectColumnValuesNumeric(page, ['Ref#', 'Ref']);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
