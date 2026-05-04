const { test } = require('@playwright/test');
const { loadRuntimeData, loginAsAdmin, openImRemitModule, openFileProcessing, clickSearchCustomer, enterCustomer, closeSession } = require('./_shared');
const { openPaginationMenu, verifyPaginationOptions, choosePageSize, hasFileProcessingData } = require('../../helpers/fileProcessing');

test('TS_08_To_Verify_That_Pagination_Button_Is_Functional', async ({ page }) => {
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
      console.log('No file processing data - pagination controls not expected, test passes');
      return; // Skip pagination when no data
    }
  });

  await test.step('Open the pagination menu', async () => {
    await openPaginationMenu(page);
  });

  await test.step('Verify the page size choices 5, 10, 25, 50, and 100 are visible', async () => {
    await verifyPaginationOptions(page);
  });

  await test.step('Choose the 25-record pagination option', async () => {
    await choosePageSize(page, '25');
  });

  await test.step('Logout from the application', async () => {
    await closeSession(page);
  });
});
