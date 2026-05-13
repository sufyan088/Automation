const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession } = require('./_shared');
const { openColumnViews, toggleFirstTwoColumnViewOptions, hasFileProcessingData } = require('../../helpers/fileProcessing');

test('TS_10_To_verify_that_Column_View_button_is_functional', async ({ page }) => {
  const data = loadRuntimeData();

  await test.step('Login into Application', async () => {
    await loginAsAdmin(page, data);
  });

  await test.step('Open imREmit', async () => {
    await openImRemitModule(page);
  });

  await test.step('Navigate to File Processing', async () => {
    await openFileProcessing(page);
  });

  await test.step('Click on Search customer', async () => {
    await clickSearchCustomer(page);
  });

  await test.step('Enter Verizon Customer', async () => {
    await enterCustomer(page, data.fileProcessingCustomer);
  });

  await test.step('Check if file processing data exists', async () => {
    const hasData = await hasFileProcessingData(page);
    if (!hasData) {
      console.log('No file processing data - column views may not be fully functional, but test gracefully handles this');
    }
  });

  await test.step('Open the Column Views panel', async () => {
    await openColumnViews(page);
  });

  await test.step('Toggle the first two column options', async () => {
    await toggleFirstTwoColumnViewOptions(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
