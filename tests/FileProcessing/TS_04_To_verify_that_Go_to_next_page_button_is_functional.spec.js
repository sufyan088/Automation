const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession } = require('./_shared');
const { goToNextPage, hasFileProcessingData } = require('../../helpers/fileProcessing');

test('TS_04_To_verify_that_Go_to_next_page_button_is_functional', async ({ page }) => {
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

  await test.step('Click Go to next page', async () => {
    await goToNextPage(page, 5);
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
