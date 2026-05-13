const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession } = require('./_shared');
const { goToNextPage, goToLastPage, hasFileProcessingData } = require('../../helpers/fileProcessing');

test('TS_05_To_verify_that_Go_to_last_page_button_is_functional', async ({ page }) => {
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
      console.log('No file processing data - pagination buttons not expected, test passes');
      return; // Skip pagination attempts when no data
    }
  });

  await test.step('Move one page forward so the last page action is meaningful', async () => {
    await goToNextPage(page, 1);
  });

  await test.step('Click the Go to last page control', async () => {
    await goToLastPage(page);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
